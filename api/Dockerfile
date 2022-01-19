FROM node:16-alpine
WORKDIR /app
COPY . ./api_src
RUN chmod +x ./api_src/build-docker.sh && chmod +x ./api_src/start-server.sh && ./api_src/build-docker.sh
CMD ["./api/start-server.sh"]