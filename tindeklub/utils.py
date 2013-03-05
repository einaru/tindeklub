# -*- coding: utf-8 -*-
"""
:file: blog/utils.py
:author: Einar Uvsløkk <einar.uvslokk@gmail.com>
:copyright: (c) 2013 Einar Uvsløkk
:license: GNU General Public License (GPL) v3 or later
"""
import re
from unicodedata import normalize


def slugify(text, delimiter="-"):
    text = get_utf8(text)
    slug_re = re.compile(r"[\t !\"#$%&'()*\-/<=>?@\[\\\]^_`{|},.]+")
    result = []
    for word in slug_re.split(text.lower()):
        word = normalize("NFKD", word).encode("ascii", "ignore")
        if word:
            result.append(word)
    return unicode(delimiter.join(result))


def get_utf8(text):
    if isinstance(text, str):
        text = text.decode("utf-8")
    return text
