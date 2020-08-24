import numpy as np
import pandas as pd
from gensim.models.doc2vec import Doc2Vec
from ._utils import tokenize
from rich.progress import track


class User2Vec(Doc2Vec):
    """TODO"""
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

    def infer_user_vectors(
        self, users, doc_words, track_progress=False, **kwargs
    ):

        users_iter = track(
            np.unique(users),
            description='Inferring User Vectors',
            refresh_per_second=2
        ) if track_progress else np.unique(users)

        user_ids = np.array([])
        user_vectors = np.empty((0, self.vector_size))
        for user in users_iter:
            mask = users == user
            user_ids = np.append(user, user_ids)
            user_vectors = np.append(
                np.expand_dims(
                    self.infer_user_vector(doc_words[mask], **kwargs),
                    0
                ),
                user_vectors,
                axis=0
            )

        return user_ids, user_vectors
