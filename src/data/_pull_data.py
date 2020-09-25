"""
Downloads and stores tweets as .json files in its raw format.

The data is stored "as is". The remaining ETL steps can be found
in separate scripts.
"""

# Author: João Fonseca <jpmrfonseca@gmail.com>
# License: MIT

import logging
import json
from searchtweets import (
    load_credentials,
    gen_rule_payload,
    collect_results,
    ResultStream
)
import os

log_fmt = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
logging.basicConfig(level=logging.INFO, format=log_fmt)


def pull_tweets(
        query,
        from_date,
        to_date,
        save_path,
        credentials_path,
        yaml_key,
        file_name=None,
        results_per_call=500,
        max_results=3000,
        verbose=False,
        **kwargs
):
    """
    Pulls data (i.e., tweets and user info) from Twitter using its API.
    The data received from the API is stored in its original form (JSON)
    without performing any type of preprocessing.

    :parameter query: TODO
    :return: None
    """

    logger = logging.getLogger(__name__)
    logger.propagate = verbose
    logger.info('Pulling raw Twitter data')

    search_args = load_credentials(
        filename=credentials_path,
        yaml_key=yaml_key
    )

    rule = gen_rule_payload(
        query,
        results_per_call=results_per_call,
        from_date=from_date,
        to_date=to_date
    )

    rs = ResultStream(
        rule_payload=rule,
        max_results=max_results,
        **search_args
    )

    if file_name is None:
        file_name = f'SAMPLE_DATA_QUERY_{query}_'\
                  + f'FROMDATE_{from_date}_TODATE_{to_date}.json'

    with open(os.path.join(save_path, file_name), 'a', encoding='utf-8') as f:
        for tweet in rs.stream():
            json.dump(tweet, f)
            f.write('\n')

    logger.info('Data successfuly saved at'
                + f'\"{os.path.join(save_path, file_name)}\"')
    return None


def count_tweets(
        query,
        from_date,
        to_date,
        credentials_path,
        yaml_key,
        count_bucket="day",
        results_per_call=500,
        verbose=False,
        **kwargs
):
    """
    Returns the number of existing Tweets for a given query and time
    frame. Since this function doesn't pull tweets, this is a safe option
    to check the effectiveness of your filters without exhausting the
    API's capacity.

    TODO: Params documentation
    """

    logger = logging.getLogger(__name__)
    logger.propagate = verbose
    logger.info('Counting Tweets')

    search_args = load_credentials(
        credentials_path,
        yaml_key=yaml_key
    )

    count_rule = gen_rule_payload(
        query,
        from_date=from_date,
        to_date=to_date,
        count_bucket=count_bucket,
        results_per_call=results_per_call
    )

    counts = collect_results(count_rule, result_stream_args=search_args)

    return counts
