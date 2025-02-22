# Update the VARIANT arg in docker-compose.yml to pick a Node version: 10, 12, 14
ARG VARIANT=16-buster
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

RUN export DEBIAN_FRONTEND=noninteractive \
  && yarn global add @nestjs/cli@8.2.6
