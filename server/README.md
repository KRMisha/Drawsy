# Server

The Drawsy server exposes a REST API which the Drawsy client can use to save and load drawings for its gallery. The drawings are stored in a MongoDB database.

The Drawsy server is made with Express.js.

## Prerequisites

<!-- prettier-ignore -->
- [Node.js 16](https://nodejs.org/en)

## Setup

### Install dependencies

```sh
npm install
```

### Create the `.env` file

1. Copy the `.env.example` file to a new `.env` file.
2. Edit the `.env` file with the proper credentials for the MongoDB database.

## Usage

### Run

#### Development

```sh
npm start
```

This will start the server with hot-reload for development.

#### Production

```sh
npm run start:prod
```

This will start the server without hot-reload, for use in production.

### Build

#### Check

```sh
npm run build:check
```

This will check that the TypeScript code can successfully compile for type-checking, but will not emit any compiler output.

#### Docker image

```sh
# Build context needs to be the project's root directory
docker build -t drawsy/server -f Dockerfile ..
```

This will build the Docker image which is used in production.

### Test

```sh
npm test
```

#### Code coverage

```sh
npm run coverage
```

### Lint

```sh
npm run lint
```

### Format

```sh
npm run format
```
