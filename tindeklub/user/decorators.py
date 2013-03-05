# -*- coding: utf-8 -*-
"""
:file: user/models.py
:author: Einar Uvsløkk <einar.uvslokk@gmail.com>
:copyright: (c) 2013 Einar Uvsløkk
:license: GNU General Public License (GPL) v3 or later
"""
from functools import wraps
from flask import g, flash, redirect, url_for, request
from flask.ext.babel import gettext as _


def requires_login(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if g.user is None:
            flash(_("You need to be signed in for this page."))
            return redirect(url_for("user.login", next=request.path))
        return f(*args, **kwargs)
    return decorated_function
