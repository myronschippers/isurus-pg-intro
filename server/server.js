const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
const PORT = 5000;

// CREATING POOL
const Pool = pg.Pool;
const pool = new Pool({
    database: 'music_library',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
});

pool.on('connect', () => {
    console.log('Pool is connected');
})

pool.on('error', (error) => {
    console.log('Oh NO ERROR: ', error);
});

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// LET's MAKE SOME ROUTES

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

app.listen(PORT, () => {
    console.log('Listening on port: ', PORT);
});