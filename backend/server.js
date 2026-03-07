const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();
const cookieParser = require("cookie-parser");
const JWT_SECRET = "your_super_secret_key_123"
const PORT = 3001;
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());


const jwt = require('jsonwebtoken');
app.use('/images', express.static(path.join(__dirname, 'images')));

const db = new sqlite3.Database('./shop.db', (err) => {
    if (err) console.error(err.message); console.log("Connected to SQLite database");
});


app.use(function (req, res, next) {
    const token = req.cookies.ecommerce_token;
    req.user = false;
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        } catch (err) {
            req.user = false
        }
    }
    next();
})

function mustBeLoggedIn(req, res, next) {
    console.log(req.user);
    if (req.user) {
        return next();
    }
    return res.status(401).json({ error: "Unauthorized" });
}

app.get('/api/products', (req, res) => {
    const sql = "SELECT * FROM products";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const products = rows.map(row => ({ id: row.id, image: `http://localhost:${PORT}/${row.image}`, name: row.name, rating: { stars: row.rating_stars, count: row.rating_count }, priceCents: row.price_cents, keywords: JSON.parse(row.keywords) }));
        res.json(products);
    });
});

app.get("/", mustBeLoggedIn, (req, res) => {
    if (req.user) {
        console.log(req.user);
        return res.render("/") // Use return to prevent further execution
    }
    res.render("/login");
});
app.post('/api/register', (req, res) => {
    const { fullName, email, password, phone } = req.body;

    const sql = "INSERT into users (name,email,password,phone) VALUES (?,?,?,?)"
    const params = [fullName, email, password, phone]

    db.run(sql, params, function (err) {
        if (err) { return res.status(400).json({ error: err.message }) }
        res.json({ message: "User saved!", id: this.lastID })
    });
});
app.post('/api/loginCheck', (req, res) => {
    const { email, password } = req.body;
    const sql = `SELECT * FROM users WHERE email = ?`;

    db.get(sql, [email], (err, row) => {
        if (err) { return res.status(500).json({ error: "Database Error" }) }
        if (!row) { return res.status(404).json({ massage: "User Not Exist" }) }

        if (row.password === password) {

            const token = jwt.sign(
                { id: row.id, email: row.email },
                JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.cookie("ecommerce_token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000
            });
            return res.status(200).json({
                message: "Login Sucessfully",
                user: { id: row.id, name: row.name, email: row.email }
            });
        } else {
            return res.status(401).json({ message: "Incorrect Password" });
        }
    });
});
app.get('/api/check-auth', (req, res) => {
    console.log("DATA : ", req.user);
    if (req.user) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
