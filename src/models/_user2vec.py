import numpy as np
import pandas as pd
from gensim.models.doc2vec import Doc2Vec


class User2Vec(Doc2Vec):
    """TODO"""
    def __init__(self, vector_size, min_count, epochs, **kwargs):
        super().__init__(
            vector_size=vector_size,
            min_count=min_count,
            epochs=epochs,
            **kwargs
        )

    def infer_vectors(self, users, doc_words, **kwargs):
        """Docs within doc_words must be tokenized."""
        srs_doc_words = pd.Series(doc_words)

        # Vectorize docs within doc_words
        doc_vectors = srs_doc_words.apply(
            lambda doc: np.expand_dims(
                self.infer_vector(tokenize(doc)), axis=0
            )
        )

        doc_vectors = np.concatenate(doc_vectors, 0)

        user_ids = np.array([])
        user_vectors = np.empty((0, self.vector_size))
        for user in np.unique(users):
            mask = users == user
            user_ids = np.append(user, user_ids)
            user_vectors = np.append(
                np.expand_dims(doc_vectors[mask].mean(0), 0),
                user_vectors,
                axis=0
            )

        return user_ids, user_vectors

