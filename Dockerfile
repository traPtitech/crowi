FROM node:12.22.12-buster-slim AS builder

ARG NODE_ENV="production"

ENV CROWI_VERSION v1.7.9
ENV NODE_ENV ${NODE_ENV}

# Buster packages have moved off the regular Debian mirrors.
RUN sed -i \
      -e 's/deb.debian.org/archive.debian.org/g' \
      -e 's/security.debian.org/archive.debian.org/g' \
      -e '/buster-updates/d' \
      /etc/apt/sources.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates git \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /crowi

ADD . /crowi
RUN npm ci --unsafe-perm --no-audit

CMD npm run start
