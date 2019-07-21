FROM node:8

RUN apt-get update

EXPOSE 9000

ADD . /app
WORKDIR /app
RUN yarn

CMD yarn three
