#!/bin/bash
#
# tools/todo.sh
#
# Copyright (c) 2013 Einar Uvsløkk

SOURCE_FOLDER=tindeklub

# Workaround to exlude matches in this file when doing git grep
todo=$(echo todo  | tr '[a-z]' '[A-Z]')
hack=$(echo hack  | tr '[a-z]' '[A-Z]')
fixme=$(echo fixme | tr '[a-z]' '[A-Z]')

if [[ ! -d $SOURCE_FOLDER ]]; then
	cd ..
fi

usage()
{
	cat <<-EndUsage
	Usage: $0 [options]

	Extract $todo, $fixme and $hack labels found in the source code.

	Options:
	  -h    show this help message and exit
	  -g    extract only from files in the repository

	EndUsage
}

do_grep_todo()
{
	grep -ERinr "$todo|$fixme|$hack" $SOURCE_FOLDER/*
}

do_git_grep_todo()
{
	git grep -n -e $todo -e $fixme -e $hack
}

DO_GIT_GREP=false
DO_ADD=false

while getopts "hg" flag; do

	case $flag in
		h) usage ; exit 0 ;;
		g) DO_GIT_GREP=true; ;;
		?) usage ; exit 1 ;;
	esac

done

if $DO_GIT_GREP ; then
	do_git_grep_todo
else
	do_grep_todo
fi

exit 0
