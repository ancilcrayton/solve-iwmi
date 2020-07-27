# Amphan: Analyzing Experiences of Extreme Weather Events using Online Data

## DSSG Solve Team: Ancil Crayton, João Fonseca, Kanav Mehra, Jared Ross, Marcelo Sandoval-Castañeda
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


--------

<p><small>Project based on the <a target="_blank" href="https://drivendata.github.io/cookiecutter-data-science/">cookiecutter data science project template</a>. #cookiecutterdatascience</small></p>
