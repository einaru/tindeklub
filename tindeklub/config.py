# -*- coding: utf-8 -*-
"""
:file: config.py
:author: Einar Uvsløkk <einar.uvslokk@gmail.com>
:copyright: (c) 2013 Einar Uvsløkk
:license: GNU General Public License (GPL) v3 or later
"""
import os
_basedir = os.path.abspath(os.path.dirname(__file__))

DEBUG = True
ADMINS = frozenset(["einar.uvslokk@gmail.com"])
SECRECT_KEY = "monkey business"

SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(_basedir, "tindeklub.db")
DATABASE_CONNECT_OPTIONS = {}

THREADS_PER_PAGE = 8
