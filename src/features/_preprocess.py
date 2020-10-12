"""
Preprocessing functions to convert merged dataframe full text into text for NLP
use
"""

import nltk
nltk.download('vader_lexicon')
import string
from googletrans import Translator
from nltk.corpus import stopwords
from preprocessor import api
from nltk.sentiment.vader import SentimentIntensityAnalyzer


def translate_tweet(text, lang):
    """
    Translate a block of text (this function is the main reason preprocessing
    runs so slow)

    Args:
        text - text that you want to translate6
        lang - langauge of original text


    Returns:
        trans - translated text
    """
    trans = Translator()
    return trans.translate(text).text


def translate_func(x, text, lang):
    """
    Function to use apply on all rows of the dataframe to translate text.
    Performs better then itterrow
    """
    if x[lang] != 'en':
        process = translate_tweet(x[text], x[lang])
    else:
        process = x[text]
    return process


def preprocessDataFrame(df):
    """
    Function to run basic preprocessing pipeline on all tweets to generate "full_text_processed":
    - Translating tweets to English
    - Removing Stopwords & Lemmatization
    - Removing URLs and reserved words
    - Lowercasing & punctuation removal

    Args:
        df - DataFrame with original tweets

    Returns:
        df - DataFrame with processed tweets
    """
    df['full_text_processed'] = df.apply(
        lambda x: translate_func(x, 'full_text', 'lang'),
        axis=1
    )

    # for some reason some rows are type float so make sure nothing will crash
    df['full_text_processed'] = df['full_text_processed'].astype(str)

    api.set_options('urls', 'reserved_words')
    df['full_text_processed'] = df['full_text_processed'].apply(
        lambda x: api.clean(x)
    )
    df['full_text_processed'] = df['full_text_processed'].apply(
        lambda x: x.lower()
    )

    def remove_punct(text):
        table = str.maketrans('', '', string.punctuation)
        return text.translate(table)

    df['full_text_processed'] = df['full_text_processed'].apply(
        lambda x: remove_punct(x)
    )

    lemmatizer = nltk.stem.WordNetLemmatizer()
    df['full_text_processed'] = df['full_text_processed'].apply(
        lambda x: ' '.join([lemmatizer.lemmatize(w) for w in x.split()])
    )

    stop_words = set(stopwords.words('english'))
    df['full_text_processed'] = df['full_text_processed'].apply(
        lambda x: ' '.join(
            [word for word in x.split() if word not in stop_words]
        )
    )

    sid = SentimentIntensityAnalyzer()

    def create_sentiment(x, text):
        return sid.polarity_scores(text)['compound']
    # add sentiment as part of preprocessing
    df['sentiment'] = df.apply(
        lambda x: create_sentiment(x, x['full_text_processed']), axis=1
    )

    return df
