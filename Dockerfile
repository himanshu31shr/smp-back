FROM node:20.11.0-alpine3.19

RUN apk add build-base

RUN wget -O - https://github.com/jemalloc/jemalloc/releases/download/5.2.1/jemalloc-5.2.1.tar.bz2 | tar -xj && \
    cd jemalloc-5.2.1 && \
    ./configure && \
    make && \
    make install

ENV LD_PRELOAD=/usr/local/lib/libjemalloc.so.2

WORKDIR /project

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ENV TZ=UTC

COPY package*.json /project/
COPY . /project

RUN rm -rf node_modules
RUN npm ci --omit=dev

RUN npm i -g pm2 sequelize-cli

EXPOSE 3000

CMD [ "pm2-runtime", "ecosystem.config.js", "--env development" ]