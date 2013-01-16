#!/bin/bash

# depends on imagemagick convert tool
#    apt-get install imagemagick

SVGFILE=${1:-./images/taulabs-favicon.svg}

# Make sure we're running from the top level of the web tree
if [ ! -e CNAME -o ! -e index.html ] ; then
	echo "This script should be run from the top of the web tree"
	exit 1
fi

# Make sure we can find our source image
if [ ! -r ${SVGFILE} ] ; then
	echo "Source image missing: ${SVGFILE}"
	exit 1
fi

# Tell the caller which source file we're using
echo "Using ${SVGFILE} as source image"

# Make a temporary directory to hold the intermediate files
T=$(mktemp -d)

# Convert the .svg file into a series of PNG files sized in various square dimensions
#  e.g. favicon-64.png
#
echo -n "Generating icons..."
for dim in 16 32 64 128 256 ; do
	echo -n "${dim} "
	convert ${SVGFILE} -transparent white -resize ${dim}x${dim} ${T}/favicon-$(printf "%04u" ${dim}).png
done
echo "done"

# Convert the intermediate files into a consolidated ICO file
echo -n "Merging icons into favicon.ico..."
convert ${T}/favicon-*.png favicon.ico
echo "done"

# Clean up the temporary directory
[ -d "${T}" ] && rm -r "${T}"
