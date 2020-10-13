Commands
========

The Makefile contains the central entry points for common tasks related to this project.

* `data_pull`: Pull raw data 
* `create_network`: Create Docker Network 
* `etl`: Transform and Load data into the Elastic Search server
* `database`: Create and/or Open local Elastic Search Server 
* `close_database`: Close local Elastic Search Server 
* `load_es`: Load preprocessed data into an Elastic Search server 

Utilities
^^^^^^^^^

* `create_environment`: Set up python interpreter environment 
* `requirements`: Install Python Dependencies 
* `test_environment`: Test python environment is setup correctly 
* `lint`: Lint using flake8 
* `clean`: Delete all compiled Python files 
