#!/bin/bash
set -euo pipefail

pushd dist
rm -f checksum.txt
touch checksum.txt

FILES=$(ls mzm-*)
for FILE in $FILES
do
  echo "$(sha1sum ${FILE})" | tee -a checksum.txt
done

popd
