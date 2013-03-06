#!/bin/bash
#
# tools/todo.sh
#
# Copyright (c) 2013 Einar Uvsløkk

TODO_FILE=TODO
SOURCE_FOLDER=tindeklub

if [[ ! -d $SOURCE_FOLDER ]]; then
	cd ..
fi

usage()
{
	cat <<-EndUsage
	Usage: $0 [options]

	Extract all TODO labels found in the source code.

	Options:
	  -h    show this help message and exit
	  -g    extract only from files in the repository
	  -a    add generated $TODO_FILE-file to git

	EndUsage
}

do_grep_todo()
{
	echo "grep"
	grep -ERinr "TO[_ ]?DO|FIX[_ ]?ME|HACK" $SOURCE_FOLDER/* > $TODO_FILE
}

do_git_grep_todo()
{
	echo "git grep"
	git grep -n -e TODO -e FIXME -e HACK > $TODO_FILE 
}

DO_GIT_GREP=false
DO_ADD=false

while getopts "hga" flag; do

	case $flag in
		h) usage ; exit 0 ;;
		g) DO_GIT_GREP=true; ;;
		a) DO_ADD=true ; ;;
		?) usage ; exit 1 ;;
	esac

done

if $DO_GIT_GREP ; then
	do_git_grep_todo
else
	do_grep_todo
fi

if $DO_ADD ; then
	echo "Adding $TODO_FILE to git"
	git add $TODO_FILE
fi

exit 0
