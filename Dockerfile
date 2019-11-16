FROM node:12.3.1-stretch-slim

RUN mkdir -p /opt/bot/server
WORKDIR /opt/bot

COPY package.json /opt/bot
COPY .env /opt/bot
RUN npm install

COPY ./server/ /opt/bot/server/

EXPOSE 9001
CMD [ "npm", "start" ]
