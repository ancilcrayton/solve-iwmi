from flask import Flask,request
from flask_cors import CORS
from flask import send_file

from controller.ctrlr_search import searchbp
from controller.ctrlr_auth import authbp
from middleware import login_manager

app = Flask(__name__)
app.secret_key = 'lolimaginethisbeingsecret'  # Change this!

CORS(app, supports_credentials=True)

app.register_blueprint(searchbp)
app.register_blueprint(authbp)

login_manager.init_app(app)

if __name__ == '__main__':
    app.run(debug=True,port=8080,host='0.0.0.0')