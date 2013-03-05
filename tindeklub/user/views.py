# -*- coding: utf-8 -*-
"""
:file: user/views.py
:author: Einar Uvsløkk <einar.uvslokk@gmail.com>
:copyright: (c) 2013 Einar Uvsløkk
:license: GNU General Public License (GPL) v3 or later
"""
from flask import (Blueprint, request, render_template, flash, g, session, 
                  redirect, url_for)
from tindeklub import oid
from tindeklub.database import db_session
from tindeklub.user.models import User


mod = Blueprint("user", __name__, url_prefix="/user")


@mod.route("/me")
def home():
    return render_template("user/profile.html", user=g.user)


@mod.before_request
def before_request():
    """Pull the `User` profile from the databse before every request is
    treated.
    """
    g.user = None
    if "openid" in session:
        g.user = User.query.filter_by(openid=session["openid"]).first()


@mod.route("/login/", methods=["GET", "POST"])
@oid.loginhandler
def login():
    """Does the login via OpenID. Has to call into `oid.try_login` to
    start the OpenID machinery.
    """
    if g.user is not None:
        return redirect(oid.get_next_url())

    if request.method == "POST":
        openid = request.form.get("openid")
        if openid:
            return oid.try_login(openid,
                                 ask_for=["email", "fullname", "nickname"])
    return render_template("user/login.html",
                           next=oid.get_next_url(),
                           error=oid.fetch_error())


@oid.after_login
def create_or_login(response):
    """This is called when login with OpenID succeeded and it's not
    necessary to figure out if this is the users's first login or not.
    This function has to redirect otherwise the user will be presented
    with a terrible URL which we certainly don't want.
    """
    session["openid"] = response.identity_url
    user = User.query.filter_by(openid=response.identity_url).first()
    if user is not None:
        flash(_("Successfully signed in"))
        g.user = user
        return redirect(oid.get_next_url())

    return redirect(url_for("create_profile",
                            next=oid.get_next_url(),
                            name=response.fullname or response.nickname,
                            email=response.email))


@mod.route('/create-profile', methods=['GET', 'POST'])
def create_profile():
    """If this is the user's first login, the create_or_login function
    will redirect here so that the user can set up his profile.
    """
    if g.user is not None or 'openid' not in session:
        return redirect(url_for('index'))
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        if not name:
            flash(u'Error: you have to provide a name')
        elif '@' not in email:
            flash(u'Error: you have to enter a valid email address')
        else:
            flash(u'Profile successfully created')
            db_session.add(User(name, email, session['openid']))
            db_session.commit()
            return redirect(oid.get_next_url())
    return render_template('create_profile.html', next_url=oid.get_next_url())


@mod.route("/logout")
def logout():
    session.pop("openid", None)
    flash(_("You have been successfully signed out"))
    return redirect(oid.get_next_url())
