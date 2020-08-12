import os
import nltk
import string
import pandas as pd
import numpy as np
import preprocessor as prep
from os.path import join
from sqlite3 import connect
import seaborn as sns; sns.set()
import matplotlib.pyplot as plt
from googletrans import Translator
from nltk.corpus import stopwords
from nltk.util import ngrams
from preprocessor import api
from nltk.sentiment.vader import SentimentIntensityAnalyzer



def translate_tweet(text, lang):
    trans = Translator()
    return trans.translate(text).text


def translate_func(x, text, lang):
    if x[lang] != 'en':
        process = translate_tweet(x[text], x[lang])
    else:
        process = x[text]
    return process

def preprocessDataFrame(df):

    df['full_text_processed'] = df.apply(lambda x: translate_func(x, 'full_text', 'lang'),axis=1)
    df['full_text_processed'] = df['full_text_processed'].astype(str)

    df['full_text_processed'] = df['full_text_processed'].apply(lambda x: api.clean(x))
    df['full_text_processed'] = df['full_text_processed'].apply(lambda x: x.lower())
    def remove_punct(text):
        table = str.maketrans('','',string.punctuation)
        return text.translate(table)

    df['full_text_processed'] = df['full_text_processed'].apply(lambda x: remove_punct(x))
    lemmatizer = nltk.stem.WordNetLemmatizer()
    df['full_text_processed'] = df['full_text_processed'].apply(lambda x: ' '.join([lemmatizer.lemmatize(w) for w in x.split()]))
    stop_words = set(stopwords.words('english'))
    df['full_text_processed'] = df['full_text_processed'].apply(lambda x: ' '.join([word for word in x.split() if word not in stop_words]))
    sid = SentimentIntensityAnalyzer()
    def create_sentiment(x,text):

        return sid.polarity_scores(text)['compound']

    df['sentiment'] = df.apply(lambda x: create_sentiment(x, x['full_text_processed']),axis=1)
    
    return df