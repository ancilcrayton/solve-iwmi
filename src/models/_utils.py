from gensim.models.doc2vec import TaggedDocument
from gensim.utils import simple_preprocess


def tokenize(doc, tag=None):
    """
    Utility function to Tokenize a single tweet.

    Parameters
    ----------
    doc : str
        Text to be tokenized.
    tag : int, str or NoneType, default=None
        Document identifier. If None, returns list of tokens instead of tagged
        document.

    Returns
    -------
    document : list or gensim.models.doc2vec.TaggedDocument
        Tokenized, tagged document
    """
    tokens = simple_preprocess(doc)
    if tag is None:
        return tokens
    else:
        return TaggedDocument(tokens, [tag])
