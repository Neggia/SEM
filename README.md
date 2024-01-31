## Description

[SEM](https://github.com/Neggia/SEM) SEM (Solidarity Economies Marketplace) Application starter repository.

## Installation

```bash
$ npm install
$ cd client
$ npm install
```

## Running the app

.env file in root folder needs the following vars:

```bash
DB_NAME=sqlite.db
ADMIN_PASSWORD=test1234
OPENAI_API_KEY=sk-abc........................................xyz
NODE_ENV=test (or prd)
CORS_ORIGIN=http://localhost:3001
SERVER_PORT=3000
```

.env file in /client subfolder needs the following vars:

```bash
REACT_APP_NAME=Comunità Solidali
REACT_APP_SERVER_BASE_URL=http://localhost:3000/
```

```bash
# server (must run on port 3000)
$ npm run start

# client
$ cd client
$ npm start
```

## Support

SEM is an GPL 3-licensed open source project.

## License

SEM is [GPL 3 licensed](LICENSE).
