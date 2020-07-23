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


@click.command()
@click.argument('configs_path', type=click.Path(exists=True))
@click.argument('configs_key', type=click.Path())
def main(configs_path, configs_key):
    """ Runs data processing scripts to turn raw data from (../raw) into
        cleaned data ready to be analyzed (saved in ../processed).
    """
    logger = logging.getLogger(__name__)
    logger.info('Pulling raw data from Twitter (via API)')


if __name__ == '__main__':
    log_fmt = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    logging.basicConfig(level=logging.INFO, format=log_fmt)

    # not used in this stub but often useful for finding various files
    project_dir = Path(__file__).resolve().parents[2]

    main()
