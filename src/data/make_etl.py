# -*- coding: utf-8 -*-
import os
import click
import logging
from pathlib import Path
import yaml
from src.data import transform, load_es


@click.command()
@click.argument('configs_path', type=click.Path(exists=True))
@click.argument('configs_key', type=click.Path())
def main(configs_path, configs_key):
    """ Runs data processing scripts to turn raw data from (../raw) into
        cleaned data ready to be analyzed (loaded into an Elastic Search
        database).
    """

    configs = yaml.full_load(open(configs_path, 'r'))[configs_key]

    logger = logging.getLogger(__name__)
    logger.info('Transforming and Loading data set from raw data')

    load_es(
        transform(configs['input_path']),
        ip_address=configs['ip_address'],
        verbose=configs['verbose']
    )

    msg = 'Successfully transformed and loaded data into Elastic '\
        + 'Search database'

    logger.info(msg)


if __name__ == '__main__':
    log_fmt = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    logging.basicConfig(level=logging.INFO, format=log_fmt)

    project_dir = Path(__file__).resolve().parents[2]
    os.chdir(project_dir)

    main()
