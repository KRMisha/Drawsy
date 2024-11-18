# Client

The Drawsy client is the web application itself, which is used to create drawings. If the gallery feature is not needed, it can function without the Drawsy server.

The Drawsy client is made with Angular.

## Prerequisites

<!-- prettier-ignore -->
- [Node.js 16](https://nodejs.org/en)
- [Angular CLI](https://v9.angular.io/cli)

    ```sh
    npm install -g @angular/cli@9
    ```

## Setup

```sh
npm install
```

## Usage

### Run

```sh
npm start
# Or ng serve
```

This will start a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

#### Development

```sh
npm run build
# Or ng build
```

This will make a development build of the project. The build artifacts will be stored in the `dist/` directory.

The development build of the Drawsy client will attempt to connect to a local instance of the Drawsy server (`http://localhost:3000/`).

#### Production

```sh
npm run build:prod
# Or ng build --prod
```

This will make a production build of the project.

Note however that the production build of the Drawsy client will not try to connect to a local instance of the Drawsy server, but to the production instance instead.

#### Docker image

```sh
# Build context needs to be the project's root directory
docker build -t drawsy/client -f Dockerfile ..
```

This will build the Docker image which is used in production.

### Test

```sh
npm test
# Or ng test
```

This will execute the unit tests via [Karma](https://karma-runner.github.io).

#### Code coverage

```sh
npm run coverage
```

This will run the unit tests and generate a coverage report.

### Lint

```sh
npm run lint
```

### Format

```sh
npm run format
```

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.
