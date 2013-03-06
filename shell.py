#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
:file: shell.py
:author: Einar Uvsløkk <einar.uvslokk@gmail.com>
:copyright: (c) 2013 Einar Uvsløkk
:license: GNU General Public License (GPL) v3 or later
"""
import os
import readline
from pprint import pprint

from flask import *
from tindeklub import *

os.environ["PYTHONINSPECT"] = "True"
