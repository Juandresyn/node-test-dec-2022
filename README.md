# Backend Test for Double Nines

## Typescript / Express / Typeorm

### Requirements
- Node 14+
- npm v6+
- PostgreSQL 14+
- Docker

## Run with NPM (will run Docker commands)
`npm start`

## Run with Yarn (will run Docker commands)
`yarn start`

## Run with docker
### Build
`docker-compose build`

### Run
`docker-compose up`

## Run stand alone
### Requires local DB running + `.env` file with corresponding DB connection variables
`npm run start:local`

It normally runs over the `:8881` port.

### Instructions
- Download the repo.
- Set the configuration parameters in the `docker-compose.yml` file.
- run `npm install`
- In Postman or any other client, send a `GET` request to `<host:port>/api/` to see the API welcome response.


### Testing
- Enable test DB: run `npm run docker:test-db` or use local database connection variables in `.env`
- Run `npm test` to start the unit tests.

## API
- Users: `/users` -> `[GET, POST]`
  - User: `/users/:ID` -> `[GET, DELETE, UPDATE]`
- Cars: `/cars` -> `[GET, POST]`
  - Car: `/cars/:ID` -> `[GET, DELETE, UPDATE]`
- Reservations: `/reservations` -> `[GET, POST]`
  - Reservations: `/creservations/:ID` -> `[GET, DELETE, UPDATE]`


## DB schema
Found in: `src/entities`
