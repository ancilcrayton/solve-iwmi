"""
Functions to pre proccess and load data into elasticsearch.

Takes the two data frames produced users and tweets to do a join on user id.
This is done since elasticsearch is a NoSQL database and performs better with
de-normalized (redundant) data

This dataframe is then inserted into the elasticsearch using the columns names
from the pandas.
"""
import logging
from elasticsearch import Elasticsearch, helpers

log_fmt = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
logging.basicConfig(level=logging.INFO, format=log_fmt)


def doc_generator(
    df,
    id_col,
    filterKeys
):
    """
    Iterate over the dataframe and yield documents to upload

    Parameters
    ----------
    df : DataFrame
        Pandas DataFrame containing the transformed Twitter data.
    id_col : str
        Column to be used for the id in the database.
    filterKeys : function
        Function to return what you want from the pandas series.

    Returns
    -------
    documents : generator
        Generator with dictionaries to insert into the database in bulk.
    """
    df_iter = df.iterrows()
    for i, document in df_iter:
        doc = {
            "_id": document[id_col],
        }
        doc.update(filterKeys(document))
        yield doc


def load_es(
    df_merged,
    ip_address='localhost',
    verbose=False
):
    """
    Loads a dataframe into the Elastic Search database.

    Parameters
    ----------
    df_merged : DataFrame
        Merged dataframe of tweets and users.
    ip_address : str
        Elastic Search database's ip address.

    Returns
    -------
    actions : int
        Number of successully executed actions
    errors : list
        List of errors
    """

    es = Elasticsearch([ip_address])  # no args, connect to localhost:9200

    def filterKeys(document):
        # just return all the data from each row
        return document.to_dict()

    logger = logging.getLogger(__name__)
    logger.propagate = verbose
    logger.info('Loading data into Elastic Search')

    if not verbose:
        logging.disable(logging.CRITICAL)

    actions, errors = helpers.bulk(
        client=es,
        index='twitter',
        actions=doc_generator(df_merged, 'tweet_id', filterKeys),
        stats_only=(not verbose)
    )

    if not verbose:
        logging.disable(logging.NOTSET)

    return actions, errors
