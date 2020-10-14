Commands
========

The Makefile script contains the central entry points for common tasks related to this project.

===========  ==========================  =========================================================
 Topic        `make` Command              Description
===========  ==========================  =========================================================
 Data pull    ``data_pull``               Pull raw data from Twitter 
 Database     ``create_network``          Create Docker Network
 Database     ``database``                Create and/or open local Elastic Search server 
 Database     ``close_database``          Close local Elastic Search server 
 ETL          ``etl``                     Transform and load data into the Elastic Search server
 ETL          ``load_es``                 Load preprocessed data into an Elastic Search server 
 Data Viz     ``visualize``               Run user network visualization 
 Utilities    ``create_environment``      Set up python interpreter environment 
 Utilities    ``requirements``            Install Python dependencies 
 Utilities    ``test_environment``        Test Python environment is setup correctly 
 Utilities    ``lint``                    Lint using flake8 
 Utilities    ``clean``                   Delete all compiled Python files 
===========  ==========================  =========================================================
