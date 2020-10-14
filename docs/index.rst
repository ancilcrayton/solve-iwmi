Welcome to solve-iwmi documentation!
==============================================

`solve-iwmi` is the repository used by our DSSG Solve team to develop the project "Amphan: analyzing
experiences of extreme weather events using online data". It contains code for Twitter data pulling,
as well as the preprocessing pipeline, feature extraction, modelling and analysis techniques used
throughout the project.

Project Overview
----------------

With wind speeds up to 200 kilometres per hour, Cyclone Amphan was the first super cyclone to form
in the Bay of Bengal since 1999. It made landfall in West Bengal, India on May 20, 2020 before
tracing a destructive path northward to Bangladesh. Along the way, Cyclone Amphan damaged nearly 3
million houses, 18,000 square kilometres of agricultural lands and 449,000 electric poles, leaving
18 million affected people in its wake. Cyclone Amphan was also the costliest cyclone in the history
of the North Indian Ocean; India reports 13.2 billion USD in damages in the state of West Bengal
alone.

Extreme weather events are expected to increase in magnitude and frequency due to the impacts of
climate change, and Cyclone Amphan is one such example. The Bay of Bengal’s unprecedentedly high sea
surface temperature, which is linked to anthropogenic climate change, likely contributed to Cyclone
Amphan’s speed and energy. Unfortunately, warming ocean temperatures will intensify more cyclones
and hurricanes in the future — both in the Bay of Bengal and beyond. Furthermore, major flooding
events are predicted to become 6 times more frequent worldwide due to climate change, and extreme
droughts are expected to affect more than 1 billion people by 2050. Thus, it is imperative to
develop and refine approaches for responding to extreme weather events that draw upon all available
tools.

In the case of Cyclone Amphan, response efforts were complicated by COVID-19. For instance, in
addition to the typical heavy rains and obstructed roads, responders had to cope with restricted
mobility due to India’s nationwide lockdown; limitations on shelter capacities due to social
distancing measures; and the need to obtain, use and distribute personal protective equipment.
On-the-ground response efforts by governments, disaster relief organizations and civil society are
no doubt crucial and life-saving following extreme weather events. Could online data serve as an
additional tool to complement on-the-ground efforts, particularly when they are hindered?

We recognize that social media does not provide a complete or representative picture of extreme
weather events, especially in low-resource environments where people may not have access to
technology. For instance, in 2019, Internet penetration in West Bengal, India was at 29%.
Furthermore, of rural Internet users in India, 72% were male. While online data should consequently
not be used alone, it could help fill knowledge gaps when there are challenges reaching affected
people, such as those caused by COVID-19.

We took Cyclone Amphan as our use case in exploring the potential for Twitter content to target
relief efforts in response to extreme weather events. We first aimed to characterize how collective
knowledge about Cyclone Amphan was produced on Twitter. Twitter is a decentralized microblogging
platform, meaning that anyone with Internet access and a Twitter account can add their commentary to
an issue — thus providing an opportunity to listen to the voices of people directly affected by
Cyclone Amphan, in addition to public officials’ formal statements and news stories, which might
have sensationalized or added layers of interpretation to on-the-ground realities. Accordingly, our
first research question was: Who and which ideas are shaping the narratives around Cyclone Amphan,
and whose experiences are going unheard? Next, we aimed to explore how to best support people
affected by extreme weather events. This led to our second research question: Can Twitter content
help identify unmet needs of people affected by Cyclone Amphan? If so, how?

The resulting web tool aims to help users better understand people and organizations’ diverse
experiences of and reactions to Cyclone Amphan, with implications for disaster relief efforts.

Getting Started
---------------

Information to :ref:`install <install_guide>`, :ref:`test <test>` and 
:ref:`contribute <contrib>` to the package.

Documentation
-------------

The main documentation. The :ref:`user guide <user_guide>` contains an abridged
description of our project as well as realizations
of it and how to apply it. It also contains the exact :ref:`API
<api_description>` of all functions and classes, as given in the docstring.

Technical Report
----------------

The :ref:`technical report <technical_report/introduction>` contains a detailed description
of the work developed towards this project.

Additional Information
----------------------

:ref:`about <about_section>` section of cluster-over-sampling.

See the `README <https://github.com/ancilcrayton/solve-iwmi/blob/master/README.md>`_
for more information.


Contents
--------

.. toctree::
   :maxdepth: 2
   :caption: Getting Started

   install
   contribute

.. toctree::
   :maxdepth: 2
   :caption: Documentation
   
   user-guide
   commands
   api

.. toctree::
   :maxdepth: 2
   :caption: Technical Report
   :glob:

   technical_report/*

.. toctree::
   :maxdepth: 2
   :caption: Additional Information

   about

