#!/usr/bin/env sh

#
# Library package build watch
# 
# This script generates typescript declarations and a set of es modules + cjs modules of a particular
# workspace's source. When a file changes, it does a rebuild of that file.
# See ./build.sh for more info
#
tsc --project tsconfig.build.json --watch \
  & BABEL_ENV=production BABEL_MODULE_MODE=es babel src -d --out-dir dist/es --copy-files --no-copy-ignored --extensions '.js,.ts,.tsx' --watch --verbose \
  & BABEL_ENV=production BABEL_MODULE_MODE=cjs babel src -d --out-dir dist/lib --copy-files --no-copy-ignored --extensions '.js,.ts,.tsx' --watch --verbose
