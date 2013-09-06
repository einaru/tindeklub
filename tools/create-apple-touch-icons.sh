#!/usr/bin/bash

usage()
{
	cat <<-EndUsage
	./$(basename $0) [-h]
	tools/$(basename $0) [-h]

	Create a set of apple-touch-icons for the website.
	The script must be run from within the tools folder or the project root.

	Optional arguments

	  -h, --help    show this help message and exit

	EndUsage
}

case $1 in
	-h|--help) usage ; exit 0;;
esac

# Get root path
if [[ $(basename `pwd`) == 'tools' ]]; then
	rootPath="$(cd .. ; pwd)"
else
	rootPath=$(pwd)
fi

# Validate the root path
if [[ ! -f "$rootPath/package.json" ]]; then
	usage ; exit 1
fi

sizes=( 57 72 114 144 )
sourceFile='favicon.svg'
imgPath="$rootPath/public/img"

for size in ${sizes[@]}; do
	if [[ $size -eq 57 ]]; then
		exportFile='apple-touch-icon.png'
	else
		exportFile="apple-touch-icon-${size}x${size}.png"
	fi
	inkscape $imgPath/$sourceFile -e $imgPath/$exportFile -w $size -h $size
done

exit 0
