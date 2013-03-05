# -*- coding: utf-8 -*-
"""
:file: __init__.py
:author: Einar Uvsløkk <einar.uvslokk@gmail.com>
:copyright: (c) 2013 Einar Uvsløkk
:license: GNU General Public License (GPL) v3 or later
"""
from flask import Flask, render_template
from flask_openid import OpenID
from flaskext.babel import Babel, gettext as _
from flaskext.markdown import Markdown
from tindeklub.gear.models import Gear
from tindeklub.blog.models import Post


app = Flask(__name__)
app.config.from_object("tindeklub.config")
app.config.update(
    SECRET_KEY = "monkey business"
)

babel = Babel(app)
oid = OpenID(app)
Markdown(app)


@app.template_filter("friendlytime")
def friendlytime(dt):
    return dt.strftime("%A, %M %d, %Y")


@app.template_filter("shortisotime")
def shortisotime(dt):
    return dt.strftime("%Y-%m-%d")


@app.route("/")
def home():
    latest_gear = Gear.query.order_by("date_added").limit(5)
    latest_posts = Post.query.order_by("date_created").limit(5)
    return render_template("home.html",
                           latest_gear=latest_gear,
                           latest_posts=latest_posts)


from tindeklub.user.views import mod as UserModule
from tindeklub.gear.views import mod as GearModule
from tindeklub.blog.views import mod as BlogModule

app.register_blueprint(UserModule, url_prefix="/user")
app.register_blueprint(GearModule, url_prefix="/gear")
app.register_blueprint(BlogModule, url_prefix="/blog")
