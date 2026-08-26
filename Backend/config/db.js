import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect((err) => {
    if (err) {
        console.log("Database connection failed");
        console.log(err);
        return;
    }

    console.log("MySQL database connected");
});
export default connection;
