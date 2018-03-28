#!/bin/bash

set -e

npx standard-version
git push --follow-tag origin master

npm publish