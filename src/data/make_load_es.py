import os
from os.path import join
import click
import logging
from pathlib import Path
import yaml
import pandas as pd
from rich.progress import track
from src.data import load_es


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
    logger.info('Loading data into Elastic Search database')

    if os.path.isdir(configs['input_path']):
        logger.info(
            '`input_path` is a directory. ' +
            'Reading all files in it'
        )
        files = [
            f
            for f in os.listdir(configs['input_path'])
            if not f.startswith('.')
        ]
        for file_ in track(
            files,
            description='LOAD ES'
        ):
            df = pd.read_json(join(configs['input_path'], file_), convert_dates=False)
            df = df.where(df.notnull(), None)
            load_es(
                df,
                ip_address=configs['ip_address'],
                verbose=False
            )
    else:
        df = pd.read_json(configs['input_path'])
        df = df.where(df.notnull(), None)
        load_es(
            preprocessed,
            ip_address=configs['ip_address'],
            verbose=configs['verbose']
        )


    msg = 'Successfully loaded data into Elastic '\
        + 'Search database'

    logger.info(msg)


if __name__ == '__main__':
    log_fmt = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    logging.basicConfig(level=logging.INFO, format=log_fmt)

    project_dir = Path(__file__).resolve().parents[2]
    os.chdir(project_dir)

    main()
