const express = require('express');
const sqlite3 = require('sqlite3').verbose();


const app = express();

const db = new sqlite3.Database('../backend/shop.db', (err) => {
    if (err) console.error(err.mesaage);
    console.log("Connected to the SQLite DB");
})

db.run(`DROP TABLE IF EXISTS cart;
        `);

app.listen(3001, () => console.log('Server running on port 3001'));