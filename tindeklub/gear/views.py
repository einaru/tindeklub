# -*- coding: utf-8 -*-
"""
:file: gear.py
:author: Einar Uvsløkk <einar.uvslokk@gmail.com>
:copyright: (c) 2013 Einar Uvsløkk
:license: GNU General Public License (GPL) v3 or later
"""
from flask import Blueprint, render_template
from tindeklub.gear.models import Gear


mod = Blueprint("gear", __name__, url_prefix="/gear")


@mod.route("/")
def show_gear_list():
    gear_list = Gear.query.all()
    return render_template("gear/gear_list.html", gear_list=gear_list)


@mod.route("/<int:id>")
def show_gear(id):
    gear = Gear.query.get(id)
    page = "gear/show_{}.html".format(gear.category)
    return render_template(page, gear=gear)
