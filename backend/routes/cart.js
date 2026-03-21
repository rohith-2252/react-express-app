const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { mustBeLoggedIn } = require('../middleware/auth');
const { PORT } = require('../config/config');

function callError(res, err) {
    return res.status(500).json({ error: err.message });
}

router.post('/', mustBeLoggedIn, (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    db.get("SELECT * FROM cart WHERE user_id = ? AND product_id = ?", [userId, productId], (err, row) => {
        if (err) return callError(res, err);

        if (row) {
            const newQty = row.quantity + Number(quantity);

            db.run("UPDATE cart SET quantity = ? WHERE cart_id = ?", [newQty, row.cart_id], err => {
                if (err) return callError(res, err);
                res.json({ message: "Quantity updated" });
            });
        } else {
            db.run(
                "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
                [userId, productId, quantity],
                function (err) {
                    if (err) return callError(res, err);
                    res.json({ message: "Added to cart", id: this.lastID });
                }
            );
        }
    });
});

router.get('/', mustBeLoggedIn, (req, res) => {
    const userId = req.user.id;

    const sql = `
    SELECT cart.quantity, products.* FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?`;

    db.all(sql, [userId], (err, rows) => {
        if (err) return callError(res, err);

        const cartItems = rows.map(row => ({
            productId: row.id,
            name: row.name,
            image: `http://localhost:${PORT}/${row.image}`,
            priceCents: row.price_cents,
            quantity: row.quantity
        }));

        res.json(cartItems);
    });
});

router.delete('/:id/:productId', (req, res) => {
    db.run(
        "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
        [req.params.id, req.params.productId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ message: "Item deleted successfully" });
        }
    );
});

router.put('/:itemCount/:productId/:userId', (req, res) => {
    db.run(
        "UPDATE cart SET quantity = ? WHERE product_id = ? AND user_id = ?",
        [req.params.itemCount, req.params.productId, req.params.userId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ message: "Item Updated successfully" });
        }
    );
});

module.exports = router;