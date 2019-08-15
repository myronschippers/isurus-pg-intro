const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
const PORT = 5000;

// CREATING POOL :: setup pg settings to be used with pool to connect to the database
const Pool = pg.Pool;
const pool = new Pool({
    database: 'music_library', // the name of database, This can Change!
    host: 'localhost', // where is the database (changes when you deploy)
    port: 5432, // the port for your database, 5432 is default Postgres port
    max: 10, // how many connections (queries) at one time
    idleTimeoutMillis: 30000, // 30 second to try to connect, otherwise cancel query (value is in milliseconds)
});

// .on here looks familiar... pool is an instance of node's "EventEmitter"
// allowing us to listen for generic events
// ------------------------------------------------------------

// Whenever the pool establishes a new client connection to the PostgreSQL backend
// it will emit the connect event with the newly connected client. This presents an
// opportunity for you to run setup commands on a client.
pool.on('connect', () => {
    console.log('Pool is connected');
})

// When a client is sitting idly in the pool it can still emit errors because it is
// connected to a live backend. If the backend goes down or a network partition is
// encountered all the idle, connected clients in your application will emit an error
// through the pool's error event emitter. The error listener is passed the error as
// the first argument and the client upon which the error occurred as the 2nd argument.
// The client will be automatically terminated and removed from the pool, it is only
// passed to the error handler in case you want to inspect it.
pool.on('error', (error) => {
    console.log('Oh NO ERROR: ', error);
});

// Setup middleware for our node / express server application 
// ---------
// Middleware must be setup before any routes are created
app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// LET's MAKE SOME ROUTES
// ------------------------------------------------------------

// GETs all of the songs from our database and sends it back to the requesting client
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

// POSTs data for a single song to the database and sends back a success status code to requesting client
// ----------
// expected POST data structure:
// req.body = {
//     artist: 'string',
//     track: 'string',
//     published: 'date', // 01-01-1988 or 1988-01-01 or 01/01/1988
// }
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

// Starts our application
app.listen(PORT, () => {
    console.log('Listening on port: ', PORT);
});