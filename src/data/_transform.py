"""
Preprocessing functions to convert raw .json tweet data into a clean(er)
dataframe.
"""

import numpy as np
import pandas as pd
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


def transform(json_path, verbose=False):
    """
    Converts a raw .json file containing Tweets' data into a clean(er)
    dataset.

    Args:
        json_path - path to json file containing the pertinent data.

    Yields:
        df_merged - dataframe with the dataframes joined on user_id so every
            row has the tweet and the user information
    """

    logger = logging.getLogger(__name__)
    logger.propagate = verbose
    logger.info('Reading json file')

    df = pd.read_json(json_path, lines=True)

    # add the original tweets that are missing in the dataset
    new_tweets = df['retweeted_status'].dropna().tolist()\
        + df['quoted_status'].dropna().tolist()
    df = pd.concat([df, pd.DataFrame(new_tweets)]).drop_duplicates('id_str')

    df_users = pd.DataFrame(df['user'].tolist())

    logger.info('Dropping irrelevant columns')
    df_tweets = df.drop(columns=[
        'id', 'in_reply_to_status_id', 'in_reply_to_user_id', 'user',
        'coordinates', 'place', 'quoted_status_id', 'favorited',
        'retweeted', 'retweeted_status', 'matching_rules', 'geo',
        'filter_level', 'display_text_range', 'contributors',
        'quoted_status', 'quoted_status_id', 'quoted_status_permalink',
        'in_reply_to_screen_name', 'text', 'extended_tweet', 'truncated',
    ])

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

    logger.info('Adding ID columns and retrieving full text of all tweets')
    df_tweets['user_id_str'] = df['user'].apply(lambda x: x['id_str'])

    def get_full_text(row):
        if (not row['truncated']) and type(row['retweeted_status']) != dict:
            return row['text']
        elif type(row['retweeted_status']) != dict:
            return row['extended_tweet']['full_text']
        elif row['retweeted_status']['truncated']:
            return row['retweeted_status']['extended_tweet']['full_text']
        else:
            return row['retweeted_status']['text']

    df_tweets['full_text'] = df.apply(get_full_text, axis=1)

    def get_retweet_id(row):
        """returns: is_retweet, original_tweet_id_str"""
        if type(row['retweeted_status']) == dict:
            return True, row['retweeted_status']['id_str']
        else:
            return False, np.nan

    df_tweets['is_retweet'], df_tweets['original_tweet_id_str'] = \
        zip(*df.apply(get_retweet_id, axis=1))
    df_tweets['is_reply'] = ~df['in_reply_to_status_id'].isna()
    df_tweets['created_at'] = pd.to_datetime(
        df_tweets['created_at'].reset_index(drop=True), utc=True
    )

    logger.info('Extracting some basic info from users dataframe')
    df_derived = pd.DataFrame(
        df_users.derived.apply(
            lambda x: x['locations'][0] if type(x) == dict else {}
        ).tolist()
    )
    df_geo = pd.DataFrame(
        df_derived.geo.apply(
            lambda x: x if type(x) == dict else {}
        ).tolist()
    )
    df_derived = pd.concat([df_derived, df_geo], axis=1).drop(columns='geo')

    logger.info('Concatenating extracted features from users dataframe')
    df_users = pd.concat(
        [df_users, df_derived.rename(
            columns={i: f'users_derived_{i}' for i in df_derived.columns})],
        axis=1
    ).drop(columns='derived')

    logger.info('Merging tweets and users dataframe')
    return merge_dataframes(
        df_users,
        df_tweets
    ).drop_duplicates(subset='tweet_id')
