.. _api_description:

===
API
===

This is the full API documentation of the `src` package.

:mod:`src.data`
---------------

.. automodule:: src.data
    :no-members:
    :no-inherited-members:

.. currentmodule:: src

.. autosummary::
   :toctree: generated/
   :template: function.rst

    data.pull_tweets
    data.count_tweets
    data.transform
    data.load_es
    data.query_es


:mod:`src.features`
-------------------

.. automodule:: src.features
    :no-members:
    :no-inherited-members:

.. currentmodule:: src

.. autosummary::
   :toctree: generated/
   :template: function.rst

   features.translate_tweet
   features.translate_func
   features.preprocessDataFrame


:mod:`src.models`
-----------------

.. automodule:: src.models
    :no-members:
    :no-inherited-members:

.. currentmodule:: src

.. autosummary::
   :toctree: generated/
   :template: function.rst

   models.tokenize

.. autosummary::
   :toctree: generated/
   :template: class.rst

   models.User2Vec
   models.ALZeroShotWrapper


:mod:`src.visualization`
------------------------

.. automodule:: src.visualization
    :no-members:
    :no-inherited-members:

.. currentmodule:: src

.. autosummary::
   :toctree: generated/
   :template: function.rst

   visualization.viz_preprocess_data
   visualization.make_dashboard_app
   
