# -*- coding: utf-8 -*-
"""
:file: models.py
:author: Einar Uvsløkk <einar.uvslokk@gmail.com>
:copyright: (c) 2013 Einar Uvsløkk
:license: GNU General Public License (GPL) v3 or later
"""
from datetime import datetime
from sqlalchemy import (Column, Integer, String, DateTime, ForeignKey, Float,
                       Text)
from tindeklub.database import Base


class Gear(Base):
    __tablename__ = "gear"
    id = Column(Integer, primary_key=True)
    manufacturer = Column(String(255))
    name = Column(String(255))
    category = Column(String(50))

    date_added = Column(DateTime, default=datetime.now)
    date_of_purchase = Column(DateTime)
    date_of_first_use = Column(DateTime)
    note = Column(Text)

    __mapper_args__ = {
        "polymorphic_identity": "gear",
        "polymorphic_on": category,
        "with_polymorphic": "*",
    }

    def __repr__(self):
        return "<Gear({}: {})>".format(self.name, self.category)


class Carabiner(Gear):
    __tablename__ = "carabiner"
    id = Column(Integer, ForeignKey("gear.id"), primary_key=True)
    shape = Column(String(50))
    type = Column(String(50))

    # Technical specifications
    weight = Column(Integer)
    major_axis_strength = Column(Integer)
    minor_axis_strength = Column(Integer)
    open_gate_strength = Column(Integer)
    gate_opening = Column(Integer)

    __mapper_args__ = {
        "polymorphic_identity": "carabiner",
    }


class Rope(Gear):
    __tablename__ = "rope"
    id = Column(Integer, ForeignKey("gear.id"), primary_key=True)
    type = Column(String(50))

    # Technical specifications
    diameter = Column(Float)
    length = Column(Integer)
    weight = Column(Integer)
    static_elongation = Column(Integer)
    dynamic_elongation = Column(Integer)
    impact_force = Column(Integer)
    UIAA_falls = Column(Integer)
    sheat_construction = Column(String(255))

    __mapper_args__ = {
        "polymorphic_identity": "rope",
    }


class Sling(Gear):
    __tablename__ = "sling"
    id = Column(Integer, ForeignKey("gear.id"), primary_key=True)
    type = Column(String(50))

    # Technical specifications
    width = Column(Integer)
    length = Column(Integer)
    strength = Column(Integer)

    __mapper_args__ = {
        "polymorphic_identity": "sling",
    }


class Protection(Gear):
    __tablename__ = "protection"
    id = Column(Integer, ForeignKey("gear.id"), primary_key=True)
    type = Column(String(50))
    category = Column(String(50))

    # Technical specifications
    size = Column(String(10))
    weight = Column(Integer)
    min_range = Column(Integer)
    max_range = Column(Integer)
    strength = Column(Integer)

    __mapper_args__ = {
        "polymorphic_identity": "protection",
    }
