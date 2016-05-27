#!/bin/bash

if [ -z ${BOT_KEY+x} ]; then
    echo "BOT_KEY is unset";
    exit
fi

curl https://api.telegram.org/bot$BOT_KEY/setWebhook \
    -F "url=https://bidbot.localtunnel.me/api/telegram/updates"
