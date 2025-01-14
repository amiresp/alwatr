# @alwatr/nginx - Alwatr Accelerated Web Server

High performance, optimized NGINX for server web applications and api proxy with fast cache.

## Cloud Native Application Best Practices

The right way of using `@alwatr/nginx` is behind kubernetes ingress or simple edge reverse-proxy, then don't config edge stuff like gzip compression, ssl, etc or even config domain or multi websites!

## Usage

### Pull image from the command line

```sh
docker pull ghcr.io/alimd/nginx:1
```

### Use as base image in Dockerfile

```Dockerfile
FROM ghcr.io/alimd/nginx:1
```

#### PWA Dockerfile Sample

```Dockerfile
ARG NODE_VERSION=lts
FROM node:${NODE_VERSION} as build-deps
WORKDIR /app
COPY package.json *.lock .
RUN yarn install --frozen-lockfile --non-interactive && yarn cache clean
COPY . .
RUN yarn build

ARG ALWATR_NGINX_VERSION=1
FROM ghcr.io/alimd/nginx:${ALWATR_NGINX_VERSION}
COPY --from=build-deps /app/dist/ .
```
