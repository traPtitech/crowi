FROM node:12.14.1-buster-slim as builder

ARG NODE_ENV="production"

ENV CROWI_VERSION v1.7.9
ENV NODE_ENV ${NODE_ENV}

# Node.js の組み込み CA に含まれない GlobalSign Root R46 を信頼する
COPY certs/GlobalSign_Root_R46.pem /usr/local/share/ca-certificates/GlobalSign_Root_R46.pem
ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/GlobalSign_Root_R46.pem

RUN printf 'deb http://archive.debian.org/debian buster main\ndeb http://archive.debian.org/debian-security buster/updates main\n' > /etc/apt/sources.list \
    && apt-get update && apt-get install -y git
WORKDIR /crowi

ADD . /crowi
RUN npm install --update npm@6 -g
RUN npm install --unsafe-perm

CMD npm run start
