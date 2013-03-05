# -*- coding: utf-8 -*-
"""
:file: blog/models.py
:author: Einar Uvsløkk <einar.uvslokk@gmail.com>
:copyright: (c) 2013 Einar Uvsløkk
:license: GNU General Public License (GPL) v3 or later
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship, backref
from tindeklub.utils import slugify
from tindeklub.database import Base


class Post(Base):
    __tablename__ = "post"
    id = Column(Integer, primary_key=True)
    title = Column(String(60))
    body = Column(String)
    date_created = Column(DateTime, default=datetime.now)
    tags = Column(String)
    slug = Column(String)
    category_id = Column(Integer, ForeignKey("category.id"))
    category = relationship("Category", backref=backref("posts", 
                                                        lazy="dynamic"))

    def __init__(self, title, body, tags, category):
        self.title = title
        self.body = body
        self.tags = tags
        self.slug = slugify(title)
        self.category = category

    def __unicode__(self):
        return self.slug


class Category(Base):
    __tablename__ = "category"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    slug = Column(String)

    def __init__(self, name):
        self.name = name
        self.slug = slugify(name)

    def __unicode__(self):
        return self.slug

