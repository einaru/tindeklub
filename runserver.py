#!/usr/bin/env python
# -*- coding: utf-8 -*-

def runserver(**kwargs):
    from tindeklub import app
    from tindeklub.database import init_db
    init_db()
    app.run(**kwargs)

if __name__ == "__main__":
    runserver(debug=True)

