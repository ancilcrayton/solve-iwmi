import sys

from flask import Blueprint,request
from flask_cors import cross_origin
from pprint import pprint

from helpers.search import createTableRows
from helpers.filters import createQueryFilters
from helpers.network import createNetwork
from database import es

searchbp = Blueprint('searchbp', __name__)

@searchbp.route("/api/search", methods=['POST'])
def search():
    print(request.json)
    sys.stdout.flush()

    resp = createTableRows(request.json)

    return {'data':resp},200

@searchbp.route("/api/dashboard", methods=['POST'])
def dashboard():
    print(request.json)
    sys.stdout.flush()

    query = createQueryFilters(request.json)
    body={
        'query':query,
        "aggregations": {
            "langPie": {
                "terms": {
                    "field": "lang.keyword"
                }
            },
            "povPie": {
                "terms": {
                    "field": "pov.keyword"
                }
            },
            "topicsBar": {
                "terms": {
                    "field": "topics.keyword"
                }
            },
            "my_sample": {
                "sampler": {
                    "shard_size": 50000
                },
                "aggregations": {
                    "wordCloud": {
                        "significant_text": {
                            "field": "full_text_trans",
                            "size":100,
                        }
                    }
                }
            },
            "avgSent": {
                "avg": {
                    "field": "sentiment"
                }
            },
            "uniqueUsers":{
                "cardinality":{
                    "field":"user_id"
                }
            },
            "rewtweetCount": {
                "value_count": {
                    "field": "is_retweet"
                }
            }
        } 
    }
    res = es.search(index = 'twitter',body=body)
    count = es.count(index='twitter',body={'query':query})

    wordCloud = [{'text':x['key'], 'value':x['doc_count']} for x in res['aggregations']['my_sample']['wordCloud']['buckets']]
    povPie = [{'id':x['key'],'label':x['key'].capitalize(),'value':x['doc_count']} for x in res['aggregations']['povPie']['buckets']]
    langPie = [{'id':x['key'],'label':x['key'].upper(),'value':x['doc_count']} for x in res['aggregations']['langPie']['buckets']]
    topicsBar = [{'topic':x['key'],'value':x['doc_count']} for x in res['aggregations']['topicsBar']['buckets']]

    return {
        'data':[],
        'wordCloud':wordCloud,
        'povPie':povPie,
        'langPie':langPie,
        'topicsBar':topicsBar,
        'avgSent':res['aggregations']['avgSent']['value'],
        'uniqueUsers':res['aggregations']['uniqueUsers']['value'],
        'rewtweetCount':res['aggregations']['rewtweetCount']['value'],
        'tweetCount':count['count']
    },200

@searchbp.route("/api/network", methods=['POST'])
def network():

    nodes,links = createNetwork(18839785)
    # nodes,links = createNetwork(891304186415022080)

    return {'nodes':nodes,'links':links},200

    #1091356337085108224