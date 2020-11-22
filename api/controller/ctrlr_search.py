import sys

from flask import Blueprint,request
from flask_cors import cross_origin
from flask_login import login_required
from pprint import pprint
from datetime import datetime

from helpers.search import createTableRows
from helpers.filters import createQueryFilters
from helpers.network import createNetwork
from database import es

searchbp = Blueprint('searchbp', __name__)

@searchbp.route("/api/search", methods=['POST'])
@login_required
def search():
""" 
Takes in filters and returns Elasticsearch Query filtered and sorted

POST Body
    check helpers/filters for all the filters used in the code 

"""
    print(request.json)
    sys.stdout.flush()

    resp = createTableRows(request.json)

    return {'data':resp},200

@searchbp.route("/api/dashboard", methods=['POST'])
def dashboard():
""" 
Takes in filters and returns data for visualizations

POST Body
    check helpers/filters for all the filters used in the code 

Yields
    langPie - Format of data for langauge pie chart
    povPie - Format of data for point of views pie chart
    topicsBar - Bar chart of top topics
    topics - Creates a line chart of the topics for each day

    avgSent - Card for average sentiment
    uniqueUsers - Number of unique users
    tweetCount - Total tweet count
    rewtweetCount - Total rewtweets
"""
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
                "terms": {
                    "field": "is_retweet"
                }
            },
            "topics": {
                "terms": {
                    "field": "topics.keyword",
                    "size": 10
                },
                "aggs": {
                    "dates": {
                        "histogram": {
                            "field": "tweet_created_at",
                            "interval":86400000 #this is a day #259200000 #this is 3 days # this is a week #604800000
                        }
                    }
                }
            }
        }
    }


    res = es.search(index = 'twitter',body=body)
    count = es.count(index='twitter',body={'query':query})

    topicLine = []
    for topic in res['aggregations']['topics']['buckets']:
        topicLine.append({
            "id":topic['key'],
            'data': [{'x': datetime.fromtimestamp(date['key']/1000).strftime('%m/%d/%Y'), 'y': date['doc_count']} for date in topic['dates']['buckets']] 
        })

    povPie = [{'id':x['key'],'label':x['key'].capitalize(),'value':x['doc_count']} for x in res['aggregations']['povPie']['buckets']]
    langPie = [{'id':x['key'],'label':x['key'].upper(),'value':x['doc_count']} for x in res['aggregations']['langPie']['buckets']]
    topicsBar = [{'topic':x['key'],'value':x['doc_count']} for x in res['aggregations']['topicsBar']['buckets']]
   
    if res['aggregations']['rewtweetCount']['buckets'][0]['key'] == 1:
        retweetCount = res['aggregations']['rewtweetCount']['buckets'][0]['doc_count']
    elif len(res['aggregations']['rewtweetCount']['buckets']) == 1:
        retweetCount = 0
    else:
        retweetCount = res['aggregations']['rewtweetCount']['buckets'][1]['doc_count']
        
    return {
        'povPie':povPie,
        'topicLine':topicLine,
        'langPie':langPie,
        'topicsBar':topicsBar,
        'avgSent':res['aggregations']['avgSent']['value'],
        'uniqueUsers':res['aggregations']['uniqueUsers']['value'],
        'rewtweetCount':retweetCount,
        'tweetCount':count['count']
    },200

@searchbp.route("/api/wordcloud", methods=['POST'])
def wordCloud():
""" 
Takes in filters and returns data for visualization of the world cloud 

POST Body
    check helpers/filters for all the filters used in the code 

Yields
    wordCloud - Data in format for the wordcloud
""""
    print(request.json)
    sys.stdout.flush()

    query = createQueryFilters(request.json)
    body={
        'query':query,
        "aggregations": {
            "my_sample": {
                "sampler": {
                    "shard_size": 50000
                },
                "aggregations": {
                    "wordCloud": {
                        "significant_text": {
                            "size":100,
                                "field": "full_text_processed",
                        }
                    }
                }
            }
        }
    }
    res = es.search(index = 'twitter',body=body)

    wordCloud = [{'text':x['key'], 'value':x['doc_count']} for x in res['aggregations']['my_sample']['wordCloud']['buckets']]

    return {
        'wordCloud':wordCloud
    },200

@searchbp.route("/api/network", methods=['POST'])
@login_required
def network():
""" 
Creates a network right now for Modi TODO add a user input of users 

Yields
    nodes
    links
""""
    nodes,links = createNetwork(18839785)
    # nodes,links = createNetwork(891304186415022080)

    return {'nodes':nodes,'links':links},200

    #1091356337085108224

