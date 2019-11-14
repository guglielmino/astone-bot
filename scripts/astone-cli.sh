#!/bin/bash

docker exec astonebot_bot_1 ./node_modules/.bin/babel-node server/astone-cli "$@"
