# Build context needs to be the project's root directory
# E.g., to build from the server subdirectory: docker build -t drawsy/server -f Dockerfile ..

FROM node:16-alpine

ENV NODE_ENV=production

WORKDIR /app/server

COPY server/package*.json ./
RUN npm ci

COPY common /app/common
COPY server /app/server

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
