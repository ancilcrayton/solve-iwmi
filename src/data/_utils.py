import pandas as pd


def query_es(client, body=None, index_query='*', scroll='2s'):
    """
    Queries an Elastic Search database to get all the results of a query.

    Parameters
    ----------
    client : elasticsearch.Elasticsearch
    body : dict or NoneType, default=None
        The search definition using the Query DSL.
    index_query : str, default='*'
        Search over indices matching passed index query.
    scroll : str, default='2s'
        Length of time to keep search context.

    Returns
    -------
    df : DataFrame
        Pandas DataFrame with data matching the passed query.
    """
    data = []

    # iterate over the list of Elasticsearch indices
    indices = client.indices.get_alias(index_query)
    for index in indices:

        # make a search() request to get all docs in the index
        resp = client.search(
            index=index,
            body=body,
            scroll=scroll  # length of time to keep search context
        )

        data.extend(resp['hits']['hits'])

        # keep track of pass scroll _id
        old_scroll_id = resp['_scroll_id']

        # use a 'while' iterator to loop over document 'hits'
        while len(resp['hits']['hits']):

            # make a request using the Scroll API
            resp = client.scroll(
                scroll_id=old_scroll_id,
                scroll=scroll
            )

            data.extend(resp['hits']['hits'])

            # keep track of pass scroll _id
            old_scroll_id = resp['_scroll_id']

    return pd.DataFrame([i['_source'] for i in data])
