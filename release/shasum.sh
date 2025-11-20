#!/bin/bash
set -exuo pipefail

pushd dist
rm -f checksum.txt
touch checksum.txt

FILES=$(ls mzm-*)
for FILE in $FILES
do
  echo "$(sha1sum ${FILE})" >> checksum.txt
done

popd
