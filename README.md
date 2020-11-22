# Amphan: Analyzing Experiences of Extreme Weather Events using Social Media Discourse

**DSSG Solve Team:**
- Ancil Crayton
- João Fonseca
- Kanav Mehra
- Jared Ross
- Marcelo Sandoval-Castañeda

## Project Partner: International Water Management Institute (IWMI)

### Background 

Droughts and floods, which account for 94% of all extreme weather-related fatalities, are predicted to become more frequent in the coming years. By 2050, more than 1 billion people worldwide will be affected by extreme drought. Similarly, major flooding events will become 6 times more frequent worldwide under climate change. These extreme weather events can have devastating impacts on communities around the globe, but the diversity of people's experiences of them are difficult to capture and communicate. 

### Objective 

The [DSSG Solve](https://www.solveforgood.org/) team aims to collaborate with the [International Water Management Institute (IWMI)](https://www.iwmi.cgiar.org/) to create an interactive web app that leverages online data such as social media posts, news headlines and research publications to paint a fuller picture of the impacts of extreme weather events, like droughts and floods. This research tool would help users better understand how people personally experience extreme weather events, enable them to compare descriptions of the extreme weather events from individuals' perspectives with local, regional and international news coverage and analyze how the effects of extreme weather events are spatially and temporally distributed, thus providing a lens into discourse on water-related issues.

Project Organization
------------

    ├── LICENSE
    ├── Makefile           <- Makefile with commands like `make data` or `make train`
    ├── README.md          <- The top-level README for developers using this project.
    ├── data
    │   ├── external       <- Data from third party sources.
    │   ├── interim        <- Intermediate data that has been transformed.
    │   ├── processed      <- The final, canonical data sets for modeling.
    │   └── raw            <- The original, immutable data dump.
    │
    ├── docs               <- A default Sphinx project; see sphinx-doc.org for details
    │
    ├── models             <- Trained and serialized models, model predictions, or model summaries
    │
    ├── notebooks          <- Jupyter notebooks. Naming convention is a number (for ordering),
    │                         the creator's initials, and a short `-` delimited description, e.g.
    │                         `1.0-jqp-initial-data-exploration`.
    │
    ├── references         <- Data dictionaries, manuals, and all other explanatory materials.
    │
    ├── reports            <- Generated analysis as HTML, PDF, LaTeX, etc.
    │   └── figures        <- Generated graphics and figures to be used in reporting
    │
    ├── requirements.txt   <- The requirements file for reproducing the analysis environment, e.g.
    │                         generated with `pip freeze > requirements.txt`
    │
    ├── setup.py           <- makes project pip installable (pip install -e .) so src can be imported
    ├── src                <- Source code for use in this project.
    │   ├── __init__.py    <- Makes src a Python module
    │   │
    │   ├── data           <- Scripts to download or generate data
    │   │   └── make_dataset.py
    │   │
    │   ├── features       <- Scripts to turn raw data into features for modeling
    │   │   └── build_features.py
    │   │
    │   ├── models         <- Scripts to train models and then use trained models to make
    │   │   │                 predictions
    │   │   ├── predict_model.py
    │   │   └── train_model.py
    │   │
    │   └── visualization  <- Scripts to create exploratory and results oriented visualizations
    │       └── visualize.py
    │
    └── tox.ini            <- tox file with settings for running tox; see tox.readthedocs.io

Installation and Setup
--------
A Python distribution of version 3.7 or higher is required to run this project. Before you begin any of the steps mentioned below, it is important you make sure your `configs.yaml` file is properly configured for your needs. More information on the possible configurations is provided in the project's `readthedocs` page. 

### Basic Installation
All `make` scripts/commands can be configured through the `configs.yaml` file. The following commands should allow you to setup this project with minimal effort:
    
    # Clone the project.
    git clone https://github.com/ancilcrayton/solve-iwmi.git
    cd solve-iwmi
    
    # Create and activate an environment 
    make create_environment 
    conda activate solve-iwmi # Adapt this line below if you're not running conda
    
    # Install project requirements
    make requirements
    
    # Read the corresponding subchapter to pull data from Twitter
    # make data_pull

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

### Pulling Twitter Data
If you intend to pull your own twitter data you must create your own yaml file with Premium twitter API credentials by running `touch twitter_creds.yaml`. It should contain the following structure:

    search_tweets_api:
        account_type: <premium OR enterprise>
        consumer_key: <YOUR_API_KEY> 
        consumer_secret: <YOUR_API_SECRET>
        endpoint: https://api.twitter.com/1.1/tweets/search/fullarchive/<YOUR_DEV_ENV_LABEL>.json

### Data ETL
If your raw data file is too large to be loaded at once into Elastic Search, you can split it into smaller chunks:

    cd data/raw
    mkdir chunked_data
    jq -c . < full_data_pull.json | split -l 10000 - chunked_data/
    # You may also chunk the smaller data pull to be loaded
    # alongside with the rest of the data
    jq -c . < data_pull_sample.json | split -l 10000 - chunked_data/small_
    # check how many tweets are there
    wc -l chunked_data/* | grep total


### Website

Once all data is created you can then bring up the website.  In the web folder make sure that you add an env file 

Env file should be called .env and look like
    REACT_APP_API_URL=(website ip or dns)

Once the env is setup all you have to do if the database is setup correctly just bring the dockers up with the command
    docker-compose up

Frontend port is set to 3000 and backend to 8080


--------

<p><small>Project based on the <a target="_blank" href="https://drivendata.github.io/cookiecutter-data-science/">cookiecutter data science project template</a>. #cookiecutterdatascience</small></p>
