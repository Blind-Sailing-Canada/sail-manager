FROM node:16-alpine
WORKDIR /app_root
COPY . .
RUN apk --update add redis
RUN chmod +x ./build-docker.sh && chmod +x ./start-servers.sh && ./build-docker.sh && rm -rf ./build-docker.sh
CMD ["./start-servers.sh"]