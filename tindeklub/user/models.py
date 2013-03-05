# -*- coding: utf-8 -*-
"""
:file: user/models.py
:author: Einar Uvsløkk <einar.uvslokk@gmail.com>
:copyright: (c) 2013 Einar Uvsløkk
:license: GNU General Public License (GPL) v3 or later
"""
from sqlalchemy import Column, String, Integer
from tindeklub.database import Base


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    email = Column(String(50))
    openid = Column(String(50))
    locale = Column(String(50))
    timezone = Column(String(50))

    def __init__(self, name, email, openid, locale="en", timezone="UTC"):
        self.name = name
        self.email = email
        self.openid = openid
        self.locale = locale
        self.timezone = timezone

    def __repr__(self):
        return "<User({})".format(self.name)
