// import express from 'express';
// import mysql from 'mysql2';
// import dotenv from 'dotenv';
// dotenv.config();
// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE
// });

// connection.connect((err) => {
//     if (err) {
//         console.log("Database connection failed");
//         console.log(err);
//         return;
//     }

//     console.log("MySQL database connected");
// });
// export default connection;


import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 5,       // keep low — Clever Cloud's free DEV plan has a small max-connections cap
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000, // sends a keep-alive ping every 10s so idle connections don't get silently closed
});

// Quick sanity check on boot — doesn't replace per-query error handling,
// just confirms the pool can actually reach the database at startup.
pool.getConnection((err, connection) => {
    if (err) {
        console.log("Database connection failed");
        console.log(err);
        return;
    }
    console.log("MySQL database connected");
    connection.release();
});

// If a connection in the pool dies unexpectedly (e.g. the DB host closes
// an idle connection), log it instead of letting it crash the whole process.
// The pool will transparently open a new connection on the next query.
pool.on('error', (err) => {
    console.log("MySQL pool error (handled, not fatal):", err.code || err.message);
});

export default pool;
