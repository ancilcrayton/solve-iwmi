# -*- coding: utf-8 -*-
import os
from os.path import join
import click
import logging
from pathlib import Path
import yaml
from src.data import (
    transform,
    load_es,
    preprocessDataFrame
)
from rich.progress import track


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

    if os.path.isdir(configs['input_path']):
        logger.info(
            '`input_path` is a directory. ' +
            'Reading all files in it'
        )
        for file in track(
            os.listdir(configs['input_path']),
            description='JSON ETL'
        ):

            preprocessed = preprocessDataFrame(
                transform(join(configs['input_path'], file))
            )
            if configs['load_es']:
                load_es(
                    preprocessed,
                    ip_address=configs['ip_address'],
                    verbose=False
                )
            else:
                preprocessed.to_json(join(configs['save_path'], file))
    else:
        preprocessed = preprocessDataFrame(
            transform(configs['input_path'])
        )
        if configs['load_es']:
            load_es(
                preprocessed,
                ip_address=configs['ip_address'],
                verbose=configs['verbose']
            )
        else:
            preprocessed.to_json(join(configs['save_path'], file))


    msg = 'Successfully transformed and loaded data into Elastic '\
        + 'Search database'

    logger.info(msg)


if __name__ == '__main__':
    log_fmt = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    logging.basicConfig(level=logging.INFO, format=log_fmt)

    project_dir = Path(__file__).resolve().parents[2]
    os.chdir(project_dir)

    main()
