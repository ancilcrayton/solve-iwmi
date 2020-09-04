def createQueryFilters(filters,index):
    query = []
    topic_filter = False

    if 'ied' in filters and filters['ied']:

        query.append({
          "term":{"model_ied":1}
        })
    if 'domain' in filters and filters['domain'] and index == 'html':
        
        query.append({
            'bool':{
                'should':list(map(
                    lambda x:{'term':{'domain.keyword':x}} ,
                    filters['domain']
                ))
            }
        })

    if 'dictionary' in filters and filters['dictionary'] and index == 'html':
    
        query.append({
            'bool':{
                'should':list(map(
                    lambda x:{'term':{'tags.keyword':x}} ,
                    filters['dictionary']
                ))
            }
        })

    if 'endDate' in filters and filters['endDate']:
        if index == 'acled':
            query.append({
                "range":{"event_date":{'lte':filters['endDate'][0:10]}}
            })
        elif index == 'html':
            query.append({
                "range":{"dateAdded":{'lte':filters['endDate'][0:10]}}
            })

    if 'startDate' in filters and filters['startDate']:
        if index == 'acled':
            query.append({
                "range":{"event_date":{'gte':filters['startDate'][0:10]}}
            })
        elif index == 'html':
             query.append({
                "range":{"dateAdded":{'gte':filters['startDate'][0:10]}}
            })

    if 'country' in filters and filters['country']:

        query.append({
            'bool':{
                'should':list(map(
                    lambda x:{'term':{'country.keyword':x}} ,
                    filters['country']
                ))
            }
        })

    if 'event' in filters and filters['event']:

        query.append({
            'bool':{
                'should':list(map(
                    lambda x:{'term':{'event_type.keyword':x}} ,
                    filters['event']
                ))
            }
        })

    if 'actor' in filters and filters['actor']:
        actors = list(map(
                    lambda x:{'term':{'actor1.keyword':x}},
                    filters['actor']
                )) + list(map(
                    lambda x:{'term':{'actor2.keyword':x}},
                    filters['actor']
                ))

        query.append({
            'bool':{
                'should':actors
            }
        })

    if 'source' in filters and filters['source']:

        query.append({
            'bool':{
                'should':list(map(
                    lambda x:{'term':{'source.keyword':x}} ,
                    filters['source']
                ))
            }
        })
    


    body = {
        'bool':{
            'must':query,
        }
    }

    return body,topic_filter