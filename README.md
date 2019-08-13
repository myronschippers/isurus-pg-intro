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

*starting `server.js` with:*

```JS
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log('Listening on port: ', PORT);
});
```

*import / require pg:*

```JS
const pg = require('pg');
```

*creating our pool and configuration:*

```JS
const Pool = pg.Pool;
const pool = new Pool({
    database: 'music_library',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
});
```

*creating event listeners for debugging our pool connection:*

```JS
pool.on('connect', () => {
    console.log('Pool is connected');
})

pool.on('error', (error) => {
    console.log('Oh NO ERROR: ', error);
});
```

*create GET API route:*

```JS
app.get('/api/all-songs', (req, res) => {
    const queryText = 'SELECT * FROM "songs";';

    pool.query(queryText)
        .then((result) => {
            console.log(result)
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('Error: ', err);
            res.sendStatus(500);
        });
});
```

*create GET API route:*

```JS
app.post('/api/song', (req, res) => {
    const newSong = req.body;
    const queryText = `INSERT INTO "songs" ("artist", "track", "published")
                        VALUES ($1, $2, $3);`;
    
    pool.query(queryText, [newSong.artist, newSong.track, newSong.published])
        .then((result) => {
            res.sendStatus(201);
        })
        .catch((err) => {
            console.log('Error posting: ', err);
            res.sendStatus(500);
        });

});
```