
.. _user_guide:

==========
User Guide
==========

API
---

All classes and functions included in `src` are intended to be used for any related problem
employing twitter data. Although, some preprocessing functions might not work in all situations due
to some hard-coded fields we deemed unnecessary to move to the `configs.yaml` file. These fields are
expected to exist in any raw twitter dataset, although it is difficult to guarantee.

As a basic example, the function `data.pull_tweets` may be imported within a python script like so:

.. code:: python

   from src.data import pull_tweets

Data ETL
--------
If your raw data file is too large to be loaded at once into Elastic Search, you can split it into smaller chunks:

.. code:: bash

    cd data/raw
    mkdir chunked_data
    jq -c . < full_data_pull.json | split -l 10000 - chunked_data/
    # You may also chunk the smaller data pull to be loaded
    # alongside with the rest of the data
    jq -c . < data_pull_sample.json | split -l 10000 - chunked_data/small_
    # check how many tweets are there
    wc -l chunked_data/* | grep total

Accessing Analyses, Test scripts and Results
--------------------------------------------

The entire analysis process is available in the project's repo under the directory `notebooks`.

**<TODO: Description of the ordering here>**

