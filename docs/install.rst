.. _install_guide:

======================
Installation and setup
======================


A Python distribution of version 3.7 or higher is required to run this project. Before you begin
using `make` commands for data pulling or ETL steps it is important to make sure your `configs.yaml`
file is properly configured for your needs.

Setting up configuration files
------------------------------

Before using the `make` commands related to data pulling and ETL, make sure the `configs.yaml` file
is properly configured for your needs. Additionally, to perform data pulling, you should create àn
`twitter-creds.yaml` file (e.g., ``touch twitter-creds.yaml``) and should be configured as follows:
 
.. code:: yaml

   sample_tweets_api:
       account_type: <ACC_TYPE>
       consumer_key: <CONSUMER_KEY>
       consumer_secret: <CONSUMER_SECRET>
       endpoint: https://api.twitter.com/1.1/tweets/search/fullarchive/<APP_NAME>.json
   
   search_tweets_api:
       account_type: <ACC_TYPE>
       consumer_key: <CONSUMER_KEY>
       consumer_secret: <CONSUMER_SECRET>
       endpoint: https://api.twitter.com/1.1/tweets/search/fullarchive/<APP_NAME>.json

Please note that if you do not intend to do any kind of data pull tests you may disregard the first
key. In the event you do want to do some sort of testing for data pulling, you must edit the `make
data_pull` command in the `Makefile` script accordingly.

Prerequisites
-------------

.. currentmodule:: src

The `src` package requires the dependencies listed in the `requirements.txt` file::

   pip install -r requirements.txt

If you intend to compile the documentation locally, you must also install the dependencies listed
in the `requirements.docs.txt` file::

   pip install -r requirements.docs.txt

The project's environment and requirements can also be installed using `make` commands (See section
:ref:`Commands <commands>`). 

Install
-------

All `make` scripts/commands can be configured through the `configs.yaml` file. The following
set of commands should allow you to setup the project with minimal effort:

.. code:: bash

    # Clone the project.
    git clone https://github.com/ancilcrayton/solve-iwmi.git
    cd solve-iwmi
    
    # Create and activate an environment 
    make create_environment 
    
    # Adapt this line below if you're not running conda
    conda activate solve-iwmi 
    
    # Install project requirements
    make requirements
    
    # Read the corresponding subchapter to pull data from Twitter
    make data_pull

    # Set up Elastic Search database (it might take a while to initialize...)
    make database

    # Extract, Transform and Load data (the last step can be to save data as JSON files instead)
    make etl

    # Load preprocessed data into ES
    make load_es
    
    #Update the data in es and create networks index for ES
    make update_es

    # Close the database
    make close_database

Alternatively, if you only intend to use the API, you can just install the `src` package using pip and GitHub::

    pip install -U git+https://github.com/ancilcrayton/solve-iwmi.git


Website
-------

Once all data is created you can then bring up the website.  In the web folder make sure that you add an env file 

Env file should be called .env and look like

.. code:: bash

    REACT_APP_API_URL=(website ip or dns)

Once the env is setup all you have to do if the database is setup correctly just bring the dockers up with the command

.. code:: bash

    docker-compose up

Frontend port is set to 3000 and backend to 8080