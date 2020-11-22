import os
from os.path import join
import click
import logging
from pathlib import Path
import yaml
import pandas as pd
from rich.progress import track

from src.data import update_es


@click.command()
@click.argument('configs_path', type=click.Path(exists=True))
@click.argument('configs_key', type=click.Path())
def main(configs_path, configs_key):
    """ Takes data from the proccesed folder and updates elasticsearch.  
    Also creates the users elasticsearch database and fills it with data for the network graphs
    """

    configs = yaml.full_load(open(configs_path, 'r'))[configs_key]

    logger = logging.getLogger(__name__)
    logger.info('Loading new data into Elastic Search database')

    update_es(
       ip_address = configs['ip_address'],
       process_dir = configs['input_path']
    )

    msg = 'Successfully loaded new data into Elastic '\
        + 'Search database'

    logger.info(msg)


if __name__ == '__main__':
    log_fmt = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    logging.basicConfig(level=logging.INFO, format=log_fmt)

    project_dir = Path(__file__).resolve().parents[2]
    os.chdir(project_dir)

    main()
