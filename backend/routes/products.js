const express = require('express');
const router = express.Router();
const {db} = require('../db/db');
const { PORT } = require('../config/config');

router.get('/', (req, res) => {
    const sql = "SELECT * FROM products";

    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

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

module.exports = router;