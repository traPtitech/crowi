FROM node:12.14.1-buster-slim@sha256:74b5b33367e7b693e42b15a691befd8ee10a9d4157718f78bed6ea289b3439ea as builder

ARG NODE_ENV="production"

ENV CROWI_VERSION v1.7.9
ENV NODE_ENV ${NODE_ENV}

RUN apt-get update && apt-get install -y git
WORKDIR /crowi

ADD . /crowi
RUN npm install --update npm@6 -g
RUN npm install --unsafe-perm

CMD npm run start
