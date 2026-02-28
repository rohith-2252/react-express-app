const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());

app.use('/images', express.static(path.join(__dirname, 'images')));

const db = new sqlite3.Database('./shop.db', sqlite3.OPEN_RANDOMLY, () => {
    if (err) {
        console.error(err.message);
    }
    else {
        console.log("Connected to SQLite database");
    }
});

app.get('/api/products', (req, res) => {
    const sql = "SELECT * FROM products";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const products = rows.map(row => ({
            id: row.id,
            image: `http://localhost:${PORT}/${row.image}`,
            name: row.name,
            rating: {
                stars: row.rating_stars,
                count: row.rating_count
            },
            priceCents: row.price_cents,
            keywords: JSON.parse(row.keywords)
        }));
        res.json(products);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
