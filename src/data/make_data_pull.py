"""
Executable Script

Downloads and stores tweets as .json files in its raw format.

The data is stored "as is". The remaining ETL steps can be found
in separate scripts.

The entire procedure can be configurated using a .yaml file. See
`configs.yaml`.
"""

# Author: João Fonseca <jpmrfonseca@gmail.com>
# License: MIT

import click
import logging
from pathlib import Path
import yaml
from os.path import join
from ._pull_data import pull_tweets, count_tweets


@click.command()
@click.argument('configs_path', type=click.Path(exists=True))
@click.argument('configs_key', type=click.Path())
def main(configs_path, configs_key):
    """
    Downloads and stores tweets as .json files in its raw format.

    The data is stored "as is". The remaining ETL steps can be found
    in separate scripts.

    The entire procedure can be configurated using a .yaml file. See
    `configs.yaml`.
    """

    configs = yaml.full_load(open(configs_path, 'r'))[configs_key]
    configs['save_path'] = join(project_dir, configs['save_path'])
    configs['credentials_path'] = join(
        project_dir, configs['credentials_path']
    )
    configs['yaml_key'] = configs['credentials_key']
    del configs['credentials_key']

    logger = logging.getLogger(__name__)
    logger.propagate = False
    logger.info('Initializing - Pulling raw data from Twitter (via API)')

    if logger.propagate:
        counts = count_tweets(**configs)
        n_tweets = 0
        for date in counts:
            n_tweets += date['count']
        logger.info(f'Total amount of tweets found: {n_tweets}')

    pull_tweets(**configs)


if __name__ == '__main__':
    log_fmt = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    logging.basicConfig(level=logging.INFO, format=log_fmt)

    project_dir = Path(__file__).resolve().parents[2]

    main()
