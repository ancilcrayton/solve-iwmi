import sys
from pprint import pprint

from database import es
from helpers.filters import createQueryFilters


def createTableRows(filters):
    """
    Takes in filters from the frontend and creates a query that elasticsearch can use

    Args: filters with the fields below (more used in helpers/filters.py)
    sort - what field the table should be sorted on
    order - if the sort is asc or desc
    size - size of the elasticsearch query
    from - what document in the db to start with. This is used when scrolling to add more documentsz to the search
    Yeilds:
        An array of filters to be used in the bool field of elasticsearch query
    """
    query = createQueryFilters(filters)

    body={
        'query':query
    }
    if filters['sort'] !='id':
        body['sort'] = [
            {filters['sort']:{"order":filters["direction"]}},
            "_score"
        ]
    body['size'] = filters['size']*2
    body['from'] = filters['from']

    #this is added for the search to create the fields that make it so the text is highlighted when returned
    if 'search' in filters and filters['search']:
    
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
        
    sys.stdout.flush()
    #actaully search the database
    rows = es.search(index = 'twitter',body=body)

    return rows['hits']