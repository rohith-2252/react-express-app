const express = require('express');
const sqlite3 = require('sqlite3').verbose();


const app = express();

const db = new sqlite3.Database('../backend/shop.db', (err) => {
    if (err) console.error(err.mesaage);
    console.log("Connected to the SQLite DB");
})

db.run(`CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        phone TEXT)
        `);

app.listen(3001, () => console.log('Server running on port 3001'));