# -*- coding: utf-8 -*-
"""
:file: blog/views.py
:author: Einar Uvsløkk <einar.uvslokk@gmail.com>
:copyright: (c) 2013 Einar Uvsløkk
:license: GNU General Public License (GPL) v3 or later
"""
from flask import (Blueprint, render_template, request, flash, redirect,
                  url_for, abort)
from flaskext.babel import gettext as _
from tindeklub.blog.models import Post, Category
from tindeklub.database import db_session


mod = Blueprint("blog", __name__, url_prefix="/blog")


@mod.route("/")
def index():
    posts = Post.query.order_by("date_created DESC").limit(5)
    return render_template("blog/posts.html", posts=posts)


@mod.route("/archive")
def archive():
    posts = Post.query.all()
    return render_template("blog/archive.html", posts=posts)


@mod.route("/post/<slug>")
def show_post(slug):
    post = Post.query.filter_by(slug=slug).first()
    if post:
        return render_template("blog/post.html", post=post)
    else:
        abort(404)


@mod.route("/post/new", methods=["GET", "POST"])
def new_post():
    if request.method == "POST":
        title = request.form["title"]
        body = request.form["body"]
        tags = request.form["tags"]
        # FIXME Add new category with new post
        category = Category.query.filter_by(name=request.form["category"]).first()
        #flash(_("There was an error with your input: {}").format(e))
        #return redirect("/blog/post/new")

        post = Post(title, body, tags, category)
        db_session.add(post)
        db_session.commit()
        return redirect(url_for("blog.show_post", slug=post.slug))
    else:
        categories = Category.query.all()
        return render_template("blog/new_post.html", categories=categories)


@mod.route("/category/<slug>")
def show_category(slug):
    category = Category.query.filter_by(slug=slug).first()
    posts = Post.query.filter_by(category=category).all()
    return render_template("category.html", posts=posts)
