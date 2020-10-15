from flask import Blueprint,request
from flask_login import UserMixin, login_user, logout_user,current_user

from middleware import login_manager

authbp = Blueprint('authbp', __name__)

users = {'iwmiAnalytics': {'password': 'iwmidssg2020'}}

class User(UserMixin):
    pass

@login_manager.user_loader
def user_loader(email):
    if email not in users:
        return

    user = User()
    user.id = email
    return user

@login_manager.request_loader
def request_loader(request):
    email = request.form.get('email')
    if email not in users:
        return

    user = User()
    user.id = email

    # DO NOT ever store passwords in plaintext and always compare password
    # hashes using constant-time comparison!
    user.is_authenticated = request.form['password'] == users[email]['password']

    return user

@authbp.route("/api/login", methods=['POST'])
def login():

    email = request.json['email']
    if request.json['password'] == users[email]['password']:
        user = User()
        user.id = email
        login_user(user)
        return 'logged in'

    return 'Bad login',400

@authbp.route("/api/logout", methods=['POST'])
def logout():
    logout_user()

    return 'logout'

@authbp.route("/api/checkLogin", methods=['POST'])
def checkLogin():
    if current_user.is_authenticated:
        return 'Logged in',200
    else:
        return 'Not logged in',400