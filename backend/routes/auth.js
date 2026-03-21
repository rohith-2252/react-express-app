const express = require('express');
const router = express.Router();
const db = require('../db/db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

router.post('/register', (req, res) => {
    const { fullName, email, password, phone } = req.body;

    const sql = "INSERT INTO users (name,email,password,phone) VALUES (?,?,?,?)";

    db.run(sql, [fullName, email, password, phone], function (err) {
        if (err) return res.status(400).json({ error: err.message });

        res.json({ message: "User saved!", id: this.lastID });
    });
});

router.post('/loginCheck', (req, res) => {
    const { email, password } = req.body;

    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) return res.status(500).json({ error: "Database Error" });
        if (!row) return res.status(404).json({ message: "User Not Exist" });

        if (row.password === password) {
            const token = jwt.sign(
                { id: row.user_id, email: row.email, name: row.name },
                JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.cookie("ecommerce_token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.json({
                message: "Login Successfully",
                user: { id: row.user_id, name: row.name, email: row.email }
            });
        }

        return res.status(401).json({ message: "Incorrect Password" });
    });
});

router.get('/check-auth', (req, res) => {
    if (req.user) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false });
    }
});

module.exports = router;