from gensim.models.doc2vec import TaggedDocument
from gensim.utils import simple_preprocess


def tokenize(doc, tag=None):
    """Tokenizes a single tweet."""
    tokens = simple_preprocess(doc)
    if tag is None:
        return tokens
    else:
        return TaggedDocument(tokens, [tag])
