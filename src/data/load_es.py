"""
Functions to pre proccess and load data into elasticsearch

Takes the two data frames produced users and tweets to do a join on user id
This is done since elasticsearch is a NoSQL database and performs better with de-normalized (redundant) data

This dataframe is then inserted into the elasticsearch using the columns names from the pandas 
"""
import json
import logging

import pandas as pd
from pprint import pprint
from elasticsearch import Elasticsearch,helpers

log_fmt = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
logging.basicConfig(level=logging.INFO, format=log_fmt)

es = Elasticsearch(['192.168.99.100']) # no args, connect to localhost:9200

def merge_dataframes(
        df_users,
        df_tweets,
        verbose=False
    ):
    """
    Merges users and tweets dataframe for input into elasticsearch

    Args:
        df_users - dataframe with all users from the data
        df_tweets - dataframe with all tweets pulled
        

    Yields:
        df_merged - dataframe with the dataframes joined on user_id so every row has the tweet and the user information
    """

    logger = logging.getLogger(__name__)
    logger.propagate = verbose
    logger.info('Merging datframes for ES')

    df_merged = pd.merge(df_users,df_tweets,left_on="id_str",right_on="user_id_str")
    df_merged = df_merged.rename(columns={
        'id_str_x': 'user_id',
        'id_str_y': 'tweet_id',
        'created_at_x': 'user_created_at',
        'created_at_y': 'tweet_created_at',
    })

    date_format = '%a %b %d %H:%M:%S %z %Y'
    df_merged['user_created_at'] = pd.to_datetime(df_merged['user_created_at'], format=date_format, errors='ignore')
    df_merged = df_merged.where(df_merged.notnull(), None)

    return df_merged

def doc_generator(
        df,
        id_col,
        filterKeys
    ):
    """
    Iterate over the dataframe and yeild documents to upload

    Args:
        df - dataframe with the data
        id_col - column to be used for the id in the database
        filterKeys - a function that can be defined to return what you want from the pandas series

    Yields:
        dictionaries for the elasticsearch to insert into the database in bulk
    """
    df_iter = df.iterrows()
    for i, document in df_iter:
        doc =  {
            "_id" : document[id_col],
        }
        doc.update(filterKeys(document))
        yield doc
        
def load_es(
        df_merged,
        verbose = False
    ):
    """
    Loads the dataframe into the database

    Args:
        df_merged - merged dataframe of tweets and users

    Yields:
        A tuple with summary information - number of successfully executed actions and list of errors
    """
    def filterKeys(document):
        #just return all the data from each row
        return document.to_dict()
        
    logger = logging.getLogger(__name__)
    logger.propagate = verbose
    logger.info('Loading data into es')

    actions, errors = helpers.bulk(
        client = es,
        index='twitter', 
        actions = doc_generator(df_merged,'tweet_id',filterKeys)
    )

    return actions,errors
