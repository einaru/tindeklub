# -*- coding: utf-8 -*-
"""
:file: __init__.py
:author: Einar Uvsløkk <einar.uvslokk@gmail.com>
:copyright: (c) 2013 Einar Uvsløkk
:license: GNU General Public License (GPL) v3 or later
"""
from flask import Flask, render_template
from flask.ext.babel import Babel, gettext as _
from flask_openid import OpenID
from tindeklub.gear.models import Gear


app = Flask(__name__)
app.config.from_object("tindeklub.config")
app.config.update(
    SECRET_KEY = "monkey business"
)

babel = Babel(app)
oid = OpenID(app)


@app.route("/")
def home():
    latest_gear = Gear.query.order_by("date_added").limit(5)
    navigation = [
        dict(caption=_("Home"), href="/", active=True),
        dict(caption=_("Blog"), href="#"),
        dict(caption=_("Gear"), href="/gear"),
        dict(caption=_("Routes"), href="#"),
        dict(caption=_("Tips"), href="#"),
        dict(caption=_("Login"), href="/user/login"),
    ]
        

    return render_template("home.html",
                           navigation=navigation,
                           latest_gear=latest_gear)


from tindeklub.user.views import mod as UserModule
from tindeklub.gear.views import mod as GearModule

app.register_blueprint(UserModule)
app.register_blueprint(GearModule)
