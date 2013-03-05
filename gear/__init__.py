# -*- coding: utf-8 -*-
"""
:file: __init__.py
:author: Einar Uvsløkk <einar.uvslokk@gmail.com>
:copyright: (c) 2013 Einar Uvsløkk
:license: GNU General Public License (GPL) v3 or later
"""
import json
from flask import (Flask, request, session, g, redirect, url_for, flash,
                  render_template)
from flask.ext.babel import Babel, gettext as _
from flask_openid import OpenID
from gear.database import db_session
from gear.models import User, Gear

app = Flask(__name__)
app.config.update(
    SECRET_KEY = "monkey business",
)

# Setup Flask-Babel
babel = Babel(app)

# Setup Flask-OpenID
oid = OpenID(app)


@app.before_request
def before_request():
    g.user = None
    if "openid" in session:
        g.user = User.query.filter_by(openid=session["openid"]).first()


@app.teardown_request
def shutdown_session(exception=None):
    db_session.remove()


@app.route("/")
def index():
    gear_list = Gear.query.all()
    return render_template("gear_list.html", gear_list=gear_list)


@app.route("/login", methods=["GET", "POST"])
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
            return oid.try_login(
                openid,
                ask_for=["email", "fullname", "nickname"]
            )
    return render_template("login.html",
        next=oid.get_next_url(),
        error=oid.fetch_error()
    )


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

    return redirect(
        url_for("create_profile",
            next=oid.get_next_url(),
            name=response.fullname or response.nickname,
            email=response.email
        )
    )


@app.route("/create-profile", methods=["GET", "POST"])
def create_profile():
    """If this is the user's first login, the create_or_login function
    will redirect here so that the user can set up his profile.
    """
    if g.user is not None or "openid" not in session:
        return redirect(url_for("index"))
    if request.method == "POST":
        name = request.form["name"]
        email = request.form["email"]
        if not name:
            flash(_("Error: you must provide a name"))
        elif "@" not in email:
            flash(_("Error: you have not entered a valid email address"))
        else:
            flash(_("Profile successfully created"))
            db_session.add(User(name, email, session["openid"]))
            db_session.commit()
            return redirect(oid.get_next_url())
    return render_template("create_profile.html", next=oid.get_next_url())


@app.route("/logout")
def logout():
    session.pop("openid", None)
    flash(_("You have been successfully signed out"))
    return redirect(oid.get_next_url())


# API routes

@app.route("/api/gearlist", methods=["GET"])
def get_gear_list():
    return json.dumps({"gearlist": []})


@app.route("/api/gear/<int:id>", methods=["GET"])
def get_gear_by_id(id):
    return json.dumps({"gear": {"id": id}})


@app.route("/api/gear/<int:id>", methods=["PUT"])
def update_gear_by_id(id):
    return json.dumps({"error": True, "message": "Not implemented yet"})


@app.route("/api/gear/<int:id>", methods=["DELETE"])
def delete_gear_by_id(id):
    return json.dumps({"error": True, "message": "Not implemented yet"})


@app.route("/api/gear", methods=["POST"])
def add_gear():
    return json.dumps({"error": True, "message": "Not implemented yet"})
