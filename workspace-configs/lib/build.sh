#!/usr/bin/env sh

#
# Library package build
#
# This script generates typescript declarations and a set of es modules + cjs modules of a particular
# workspace's source.
# Usage: Call this from a workspace yarn script (e.g. packages/ecm-client-web/package.json)
# Files:
#  * tsconfig.build.json - file path is relative to location the script is called from, which should be the workspace root.
#  * .babelrc.js/json - not referenced here but implicitly used by babel commands. this file also sits in a workspace root.
#
tsc --project tsconfig.build.json \
  && BABEL_ENV=production BABEL_MODULE_MODE=es babel src -d --out-dir dist/es --copy-files --no-copy-ignored --extensions '.js,.ts,.tsx,.snap' \
  && BABEL_ENV=production BABEL_MODULE_MODE=cjs babel src -d --out-dir dist/lib --copy-files --no-copy-ignored --extensions '.js,.ts,.tsx,.snap'
