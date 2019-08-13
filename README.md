# Introduction to PG and Pool, Talking with Postgres

[PG](https://www.npmjs.com/package/pg) is a node module that allows us to communicate with our PostgreSQL database.

PG lives between the server and database:

```
,________,         .------,            .------,                  .------.
|________|       ,'_____,'|    req > ,'_____,'|                 (        )
|        |       |      | |          | ____ | |       PG        |~------~|
|        |       |      | | - AJAX - | ____ | |    <------->    |~------~|
|        |       |      | ;          | ____ | ;                 |~------~|
|________|       |______|'   < res   |______|'                  `.______.'
 HTML/CSS          jQuery          Node / Express               PostgreSQL
```

## Installation and Setup

**Prerequisite:** Have Postico and Postgres loaded on your machine.

1. run `createdb music_library` from the terminal
1. Open Postico and create a new favorite with the *Database* entered as `music_library`
1. Open `./server/sql-queries/database.sql`
    * Copy the `CREATE TABLE` query and execute it in Postico
    * Copy the `INSERT INTO` query and execute it in Postico
1. From the root of this project directory in the terminal run `npm install`
1. To run the server run `npm start`

## Accessing our database from Node with PG
From our code's point of view, we need a way to talk to our new database server and tables. We need to connect to our database server before issuing queries. We will be using an npm package called `pg`.

We added PG to our application dependencies by running:

```
$ npm install pg
```

### Setup PG to connect to the database
```JS
```
```JS
const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');


const Pool = pg.Pool;
const pool = new Pool({
    database: 'songs', // the name of database, This can change!
    host: 'localhost', // where is your database?
    port: 5432, // the port for your database, 5432 is default for postgres
    max: 10, // how many connections (queries) at one time
    idleTimeoutMillis: 30000 // 30 second to try to connect, otherwise cancel query
});

// .on here looks familiar...this is how node can handle arbitrary events
// this is NOT required but it is very useful for debugging
pool.on('connect', () => {
    console.log('Postgresql connected');
});

// the pool with emit an error on behalf of any idle clients
// it contains if a back end error or network partition happens
pool.on('error', (error) => {
    console.log('Error with postgres pool', error)
});

// Setup express (same as before)
const app = express();

// Setup body parser - to translating request body into JSON
app.use( bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.json() );
app.use(express.static('server/public'));

// Routes would go here

// Start express
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('up and running on port', PORT);
});
```