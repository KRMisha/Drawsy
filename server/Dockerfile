# Build context needs to be from the project root directory

FROM node:12.16.1-alpine3.11

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app/server

COPY server/package*.json ./
RUN npm install --production

COPY common /app/common
COPY server /app/server

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
