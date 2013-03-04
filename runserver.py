#!/usr/bin/env python
# -*- coding: utf-8 -*-

def runserver(**kwargs):
    from gear import app
    from gear.database import init_db
    init_db()
    app.run(**kwargs)

if __name__ == "__main__":
    runserver(debug=True)

