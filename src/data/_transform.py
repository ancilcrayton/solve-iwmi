"""
Preprocessing functions to convert raw .json tweet data into a clean(er)
dataframe.
"""

import numpy as np
import pandas as pd
from sqlite3 import connect
import logging

log_fmt = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
logging.basicConfig(level=logging.INFO, format=log_fmt)


def merge_dataframes(
    df_users,
    df_tweets,
    verbose=False
):
    """
    Merges users and tweets dataframe for input into elasticsearch

    Args:
        df_users - dataframe with all users from the data
        df_tweets - dataframe with all tweets pulled


    Yields:
        df_merged - dataframe with the dataframes joined on user_id so every
            row has the tweet and the user information
    """

    logger = logging.getLogger(__name__)
    logger.propagate = verbose
    logger.info('Merging datframes for ES')

    df_merged = pd.merge(
        df_users, df_tweets, left_on="id_str", right_on="user_id_str"
    )
    df_merged = df_merged.rename(columns={
        'id_str_x': 'user_id',
        'id_str_y': 'tweet_id',
        'created_at_x': 'user_created_at',
        'created_at_y': 'tweet_created_at',
    })

    date_format = '%a %b %d %H:%M:%S %z %Y'
    df_merged['user_created_at'] = pd.to_datetime(
        df_merged['user_created_at'], format=date_format, errors='ignore'
    )
    df_merged = df_merged.where(df_merged.notnull(), None)

    return df_merged


def transform(json_path, db_path=None):
    """
    Converts a raw .json file containing Tweets' data into a clean(er)
    dataset.

    Args:
        json_path - path to json file containing the pertinent data.

    Yields:
        df_merged - dataframe with the dataframes joined on user_id so every
            row has the tweet and the user information
    """
    df = pd.read_json(json_path, lines=True)

    df_users = pd.DataFrame(df['user'].tolist())

    # I am deleting "entities" and "extended_entities" because I was unsure
    # of its advantage. Maybe it can be properly preprocessed, or at maybe
    # we can just take the useful bits out of it.
    df_tweets = df.drop(columns=[
        'id', 'in_reply_to_status_id', 'in_reply_to_user_id', 'user',
        'coordinates', 'place', 'quoted_status_id', 'favorited',
        'retweeted', 'retweeted_status', 'matching_rules', 'geo',
        'filter_level', 'display_text_range', 'contributors',
        'quoted_status', 'quoted_status_id', 'quoted_status_permalink',
        'in_reply_to_screen_name', 'text', 'extended_tweet', 'truncated',
        'entities', 'extended_entities'
    ])
    df_tweets['user_id_str'] = df['user'].apply(lambda x: x['id_str'])
    df_tweets['full_text'] = df.apply(
        lambda row:
            row['text']
            if not row['truncated']
            else row['extended_tweet']['full_text'],
        axis=1
    )

    def get_retweet_id(row):
        """returns: is_retweet, original_tweet_id_str"""
        if type(row['retweeted_status']) == dict:
            return True, row['retweeted_status']['id_str']
        else:
            return False, np.nan

    df_tweets['is_retweet'], df_tweets['original_tweet_id_str'] = \
        zip(*df.apply(get_retweet_id, axis=1))
    df_tweets['is_reply'] = ~df['in_reply_to_status_id'].isna()

    # drop columns with 100% missing values
    all_missing = df_users.columns[
        (df_users.isna().sum(0) / df_users.shape[0]) == 1
    ].tolist()

    df_users = df_users.drop(columns=[
        'id', 'url', 'default_profile', 'profile_image_url',
        'profile_image_url_https', 'profile_banner_url',
        'profile_background_image_url', 'profile_background_image_url_https',
        'profile_background_tile', 'profile_link_color',
        'profile_sidebar_fill_color', 'profile_text_color',
        'profile_use_background_image', 'default_profile_image',
        'translator_type', 'contributors_enabled', 'is_translator',
        'profile_background_color', 'profile_sidebar_border_color'
    ]+all_missing).drop_duplicates(subset='id_str', keep='first')

    df_users['derived__location'] = df_users['derived']\
        .apply(
            lambda x: x['locations'][0]['country']
            if type(x) == dict
            else x
        )

    df_users['derived'] = df_users['derived'].apply(
        lambda x: str(x) if type(x) == dict else x
    )

    if db_path is not None:
        with connect(db_path) as connection:
            df_users.to_sql(
                'users', connection, index=False, if_exists='replace'
            )
            df_tweets.to_sql(
                'tweets', connection, index=False, if_exists='replace'
            )

    return merge_dataframes(
        df_users,
        df_tweets
    )
