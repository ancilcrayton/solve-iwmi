import sys

from database import es

def createNetwork(userID):
    res = es.get(index="users", id=userID)
    ids = []
    links = []
    results = res['_source']['edges']
    if len(results) > 300:
        results = results[0:300]
    for edge in results:
        ids.append(edge["target"])
        links.append({
            'source':userID,
            'target':edge['target'],
            'distance':edge['weighted_dist']
        })
    nodeIDs = [userID]
    nodes = [{
        'id':userID,
        'name':res['_source']['name'],
        "radius": 12,
        "depth": 0,
        "color": "rgb(244, 117, 96)"
    }]

    body = {
        'query':{
            'ids':{
                'type':'_doc',
                'values':ids
            }
        },
        'size':len(ids)
    }

    res = es.search(index='users',body=body)
    
    edges = []

    for user in res['hits']['hits']:
        if int(user['_id']) not in nodeIDs:
            nodes.append({
                'id':int(user['_id']),
                'name':user['_source']['name'],
                'radius': 8,
                'depth':1,
                'color':'rgb(97, 205, 187)'
            })
            nodeIDs.append(int(user['_id']))
        edges = edges + user['_source']['edges']

    for edge in edges:
        if edge['target'] not in nodeIDs:
            nodes.append({
                'id':edge['target'],
                'name':'',
                'radius': 4,
                'depth':2,
                'color':'rgb(232, 193, 160)'
            })
            nodeIDs.append(edge['target'])

        links.append({
            'source':edge['source'],
            'target':edge['target'],
            'distance':edge['weighted_dist']
        })
        
    nodeID = [n['id'] for n in nodes]
    edgeID = [e['target'] for e in links]
    print(len(nodeID), len(list(set(nodeID))))
    sys.stdout.flush()
    return nodes,links
