FROM node as scoreborad-frontend-builder
WORKDIR /src
COPY scoreboard-frontend/package* ./
RUN npm i
COPY scoreboard-frontend .
RUN npm run build

FROM nginx
WORKDIR /usr/share/nginx/html
COPY --from=scoreborad-frontend-builder /src/build .
