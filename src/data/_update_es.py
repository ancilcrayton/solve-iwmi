import os
import pandas as pd
import numpy as np

from os.path import join
from elasticsearch import Elasticsearch, helpers



def update_es_database(
    df,
    idCol,
    transform,
    ip_address,
):
    """
    Loads the dataframe into the database

    Args:
        df - dataframe with data to update
        idCol - chooses which column to use for the id
        transform - function that takes
        ip_address - the ip address that the elasticsearch uses

    Yields:
        Updates the database with the new data
    """
    es = Elasticsearch([ip_address])

    for idx,row in df.iterrows():
        body ={
            'doc':transform(row)
        }
        print(int(row[idCol]))
        es.update(
            index='twitter',
            id=int(row[idCol]),
            body = body
        )

def ingest_topics(ip_address,process_dir):
    def transform_ingest(row):
        dic = row.to_dict()
        del dic['tweet_id']
        topics = [k for k, v in sorted(dic.items(), key=lambda item: item[1]) if v > .8]
        return {
            'topics_list':dic,
            'topics':topics
        }


    df = pd.read_csv(join(process_dir,'zstc_model_final.csv'))
    update_es_database(
        df,
        'tweet_id',
        transform_ingest,
        ip_address
    )

def ingest_translations(ip_address,process_dir):
    def transform_trans(row):

        return {
            'full_text_trans':row['full_text_trans']
        }

    df = pd.read_csv(join(process_dir,'translated_tweets.csv')) 
    update_es_database(
        df,
        'index',
        transform_trans,
        ip_address
    )

def ingest_pov(ip_address,process_dir):
    def transform_pov(row):

        return {
            'pov':row['pov']
        }

    df = pd.read_csv(join(process_dir,'pov_final.csv'))
    update_es_database(
        df,
        'id',
        transform_pov,
        ip_address
    )

def ingest_network(ip_address,process_dir):
    es = Elasticsearch([ip_address])
    nodeDF = pd.read_csv(join(process_dir,'nodes_users.csv'))
    nodeDF = nodeDF.fillna(0)

    edgeDF = pd.read_csv(join(process_dir,'edges_users.csv')) 
    edgeDF = edgeDF.replace([np.inf, -np.inf], 0)
    edgeDF = edgeDF.fillna(0)

    def docGenerator(nodeDF,edgeDF):
        for i, node in nodeDF.iterrows():
            
            try:
                res = es.search(
                    index="twitter",
                    body={
                        "query": {
                            "match":{
                                "user_id_str":int(node['node_id'])
                            }
                        }
                    }
                )
                print(int(node['node_id']))
                tweet_ids = [hit['_id'] for hit in res['hits']['hits']]
                edges = edgeDF[edgeDF['source'] == int(node['node_id'])]
                
                doc = {
                    "_id": int(node['node_id']),
                }
                doc.update({
                    'tweet_ids':tweet_ids,
                    'followers':node['Followers'],
                    'name':node['name'],
                    'edges':edges.to_dict('records')
                })
                yield doc
            except ValueError:
                pass

    actions, errors = helpers.bulk(
        client=es,
        index='users',
        actions=docGenerator(nodeDF,edgeDF)
    )
    print(errors)

def update_es(process_dir,ip_address='localhost'):
    ingest_pov(ip_address,process_dir)
    ingest_network(ip_address,process_dir)
    ingest_translations(ip_address,process_dir)
    ingest_topics(ip_address,process_dir)

if __name__ == '__main__':
    project_dir = join(os.getcwd(), os.pardir,os.pardir)
    process_dir = join(project_dir, 'data', 'processed')
    update_es(process_dir)