#!/bin/bash

docker exec astonebot_mongo_1 /usr/bin/mongo astone --eval "db.users.find({}, { _id:0 , username: 1 })"
