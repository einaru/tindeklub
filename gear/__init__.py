# -*- coding: utf-8 -*-
"""
:file: __init__.py
:author: Einar Uvsløkk <einar.uvslokk@gmail.com>
:copyright: (c) 2013 Einar Uvsløkk
:license: GNU General Public License (GPL) v3 or later
"""
import json
from flask import (Flask, request, session, g, redirect, url_for, abort,
                  render_template, flash)
from gear.database import db_session

app = Flask(__name__)


@app.teardown_request
def shutdown_session(exception=None):
    db_session.remove()


@app.route("/")
def get_index():
    return "Index"


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
