import numpy as np
import pandas as pd
from gensim.models.doc2vec import Doc2Vec
from ._utils import tokenize
from tqdm import tqdm


tqdm.pandas()


class User2Vec(Doc2Vec):
    """TODO: documentation"""
    def __init__(self, vector_size, min_count, epochs, **kwargs):

        super().__init__(
            vector_size=vector_size,
            min_count=min_count,
            epochs=epochs,
            **kwargs
        )

    def infer_user_vector(self, doc_words, **kwargs):

        srs_doc_words = pd.Series(doc_words)

        # Vectorize docs within doc_words
        doc_vectors = srs_doc_words.apply(
            lambda doc: self.infer_vector(tokenize(doc), **kwargs)
        )

        return doc_vectors.mean(0)

    def infer_user_vectors(self, users, doc_words):

        tweet_vectors = pd.Series(doc_words).progress_apply(
            lambda doc: self.infer_vector(tokenize(doc))
        ).tolist()

        df_vectors = pd.DataFrame(tweet_vectors)\
            .join(
                pd.Series(users, name='users').reset_index(drop=True)
            ).groupby('users').mean()

        user_ids = df_vectors.index.values
        user_vectors = df_vectors.values

        return user_ids, user_vectors
