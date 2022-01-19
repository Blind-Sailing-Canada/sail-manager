FROM node:16-alpine
WORKDIR /app
COPY . ./app_src
RUN chmod +x ./app_src/build-docker.sh && chmod +x ./app_src/start-server.sh && ./app_src/build-docker.sh
CMD ["./app/start-server.sh"]