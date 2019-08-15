const pg = require('pg');

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

module.exports = pool;