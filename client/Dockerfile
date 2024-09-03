# Build context needs to be the project's root directory
# E.g., to build from the client subdirectory: docker build -t drawsy/client -f Dockerfile ..

FROM node:16 AS build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY common /app/common
COPY client /app/client
RUN npm run build

FROM nginx:alpine AS prod
COPY --from=build /app/client/dist/client /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/nginx.conf
