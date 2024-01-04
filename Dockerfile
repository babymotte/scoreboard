FROM node as scoreborad-frontend-builder
WORKDIR /src
COPY scoreboard-frontend/package* ./
RUN npm i
COPY scoreboard-frontend .
RUN npm run build

FROM babymotte/worterbuch-arm:0.42.0
WORKDIR /app
COPY --from=scoreborad-frontend-builder /src/build/ /html
ENV WORTERBUCH_WEBROOT_PATH=/html
