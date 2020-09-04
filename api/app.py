from flask import Flask,request
from flask_cors import CORS
from flask import send_file

from controller.ctrlr_search import searchbp

app = Flask(__name__)
cors = CORS(app)

app.register_blueprint(searchbp)

if __name__ == '__main__':
    app.run(debug=True,port=8080,host='0.0.0.0')