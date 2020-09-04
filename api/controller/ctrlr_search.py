import sys

from flask import Blueprint,request
from flask_cors import cross_origin

from helpers.search import createTableRows

from database import es

searchbp = Blueprint('searchbp', __name__)

@searchbp.route("/api/search", methods=['POST'])
def search():
    print(request.json)
    sys.stdout.flush()

    resp = createTableRows(request.json)

    return {'data':resp},200
