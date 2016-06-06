FROM node:5.6.0

RUN mkdir -p /opt/bot/server
WORKDIR /opt/bot

COPY package.json /opt/bot
COPY .babelrc /opt/bot
RUN npm install

COPY ./server/ /opt/bot/server/

EXPOSE 9001
CMD [ "npm", "start" ]
