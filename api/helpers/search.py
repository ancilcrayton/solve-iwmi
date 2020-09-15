from database import es
from helpers.filters import createQueryFilters


def createTableRows(filters):

    query,topic_filter = createQueryFilters(filters,'html')

    body={
        'query':query,   
    }

    body['size'] = filters['size']*2
    body['from'] = filters['from']

    if 'search' in filters and filters['search']:

        query['bool']['must'].append({
            "match": {
                "full_text_trans": {
                    "query": filters['search']
                }
            }
        })
        query['bool']['must'].append({
            "match": {
                "is_retweet": {
                    "query": False
                }
            }
        })

        body['highlight'] = {
            "pre_tags" : ["<mark><b>"],
            "post_tags" : ["</b></mark>"],
            "fragment_size":500,
            "fields": {
                "full_text_trans": {
                    "highlight_query": {
                        "bool": {
                            "must": [{
                                    "match": {
                                        "full_text_trans": {
                                            "query": filters['search']
                                        }
                                    }
                            }]
                        }
                    }
                }
            }
        }

    rows = es.search(index = 'twitter',body=body)

    return rows['hits']