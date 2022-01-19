# Update the VARIANT arg in docker-compose.yml to pick a Node version: 10, 12, 14
ARG VARIANT=16.13.2
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

RUN export DEBIAN_FRONTEND=noninteractive \
  && yarn global add @nestjs/cli
