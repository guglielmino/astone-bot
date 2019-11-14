#!/bin/bash

/bin/echo  -e "Subject: Astone auctions report\n\n" $(/opt/Dockers/astone-bot/astone-cli.sh --list)|/usr/sbin/sendmail guglielmino@gumino.com
