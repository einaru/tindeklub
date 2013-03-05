#!/bin/bash
#
# tools/i18n.sh
#
# Copyright (c) 2013 Einar Uvsløkk

BABEL_CONFIG=babel.cfg
MESSAGES_FILE=messages.pot
TRANSLATIONS=translations

if [[ ! -f $BABEL_CONFIG ]]; then
	cd ..
fi

usage()
{
	cat <<-EndUsage
	Usage: $0 [-h|--help|extract|update]

	Options:
	  -h, --help    show this help message and exit
	  extract       extract translatable strings
	  update        update translatation files

	EndUsage
}

do_extract()
{
	pybabel extract -F $BABEL_CONFIG -o $MESSAGES_FILE .
}

do_update()
{
	pybabel update -i $MESSAGES_FILE -d $TRANSLATIONS
}

case $1 in
	-h|--help) usage ; exit ;;
	extract)   do_extract ;;
	update)    do_update ;;
esac
