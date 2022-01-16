FROM node:14-alpine
WORKDIR /app
COPY . ./api_src
RUN apk --update add redis
RUN chmod +x ./api_src/build-docker.sh && chmod +x ./api_src/start-server.sh && ./api_src/build-docker.sh
CMD ["./api/start-server.sh"]