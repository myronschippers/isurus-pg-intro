const express = require('express');
const pool = require('../modules/pool');

// storing express router in a variable to use on our routes
const router = express.Router();

// GETs all of the songs from our database and sends it back to the requesting client
router.get('/', (req, res) => {
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
router.post('/', (req, res) => {
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

router.delete('/delete/:id', (req, res) => {
    console.log(req.params);

    const queryText = `DELETE FROM "songs" WHERE id=$1`;

    pool.query(queryText, [req.params.id])
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log('Error deleting: ', err);
            res.sendStatus(500);
        });
})

module.exports = router;