#!/bin/bash

docker exec -i -t astonebot_mongo_1 /usr/bin/mongo astone --eval "db.auctions.find()"
