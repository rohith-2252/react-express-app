const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./shop.db');

db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
        throw err;
    }
    console.table(rows);
});

db.close();