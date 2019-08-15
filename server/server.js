const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

<<<<<<< HEAD
// Import routes
=======
>>>>>>> develop
const songsRouter = require('./routes/songs.routes');

// Extracted Pool setup into ./modules/pool.js
// ----------

// Setup middleware for our node / express server application 
// ----------
// Middleware must be setup before any routes are created
app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// LET's MAKE SOME ROUTES
// modularized routes - moved to "./routes/*.router.js"
// ------------------------------------------------------------

app.use('/api/songs', songsRouter);

// Starts our application
app.listen(PORT, () => {
    console.log('Listening on port: ', PORT);
});