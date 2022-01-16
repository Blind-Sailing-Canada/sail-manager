FROM node:14-alpine
COPY . ./app_src
RUN apk --update add redis
RUN chmod +x ./app_src/build-docker.sh && chmod +x ./app_src/start-server.sh && ./app_src/build-docker.sh
CMD ["./start-server.sh"]