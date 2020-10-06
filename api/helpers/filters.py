from dateutil import parser

def createQueryFilters(filters):
    query = []

    if 'verified' in filters and filters['verified']:

        query.append({
          "term":{"verified":True}
        })
        
    if 'topics' in filters and filters['topics']:
        query.append({
            'bool':{
                'should':list(map(
                    lambda x:{'term':{'topics.keyword':x}} ,
                    filters['topics']
                ))
            }
        })

    if 'pov' in filters and filters['pov']:
        query.append({
            'bool':{
                'must':{'term':{'pov.keyword':filters['pov']}}
            }
        })

    if 'lang' in filters and filters['lang']:
    
        query.append({
            'bool':{
                'must':{'term':{'lang.keyword':filters['lang']}}
            }
        })

    if 'endDate' in filters and filters['endDate']:
        query.append({
            "range":{"tweet_created_at":{'lte':parser.parse(filters['endDate']).timestamp()* 1000}}
        })

    if 'startDate' in filters and filters['startDate']:
        query.append({
            "range":{"tweet_created_at":{'gte':parser.parse(filters['startDate']).timestamp()* 1000}}
        })

    if 'sentStart' in filters and filters['sentStart']:
        query.append({
            "range":{"sentiment":{'gte':filters['sentStart']}}
        })

    if 'sentEnd' in filters and filters['sentEnd']:
        query.append({
            "range":{"sentiment":{'lte':filters['sentEnd']}}
        })

    if 'search' in filters and filters['search']:

        query.append({
            'bool':{
                'must':{
                    "match": {
                        "full_text_trans": {
                            "query": filters['search']
                        }
                    }
                }
            }
        })

    body = {
        'bool':{
            'must':query,
        }
    }

    return body