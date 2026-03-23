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
const { userInfo } = require('os');
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
    // console.log(req.user);
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
        // console.log(req.user);
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
            return res.status(200).json({
                message: "Login Sucessfully",
                user: { id: row.user_id, name: row.name, email: row.email }
            });
        } else {
            return res.status(401).json({ message: "Incorrect Password" });
        }
    });
});
app.get('/api/check-auth', (req, res) => {
    // console.log("DATA : ", req.user);
    if (req.user) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false });
    }
});
// app.get('/api/getLoginInfo', (req, res) => {
//     console.log(req.body.user.email);
// })

function callError(err) {
    return res.status(500).json({ error: err.message });
}

app.post(`/api/singleProduct/:productId`,mustBeLoggedIn,(req,res) =>{
    const productId = req.params.productId;
    console.log(productId);
    const data = db.get('SELECT * from products WHERE id = ?',
        [productId],
        function(err,row){
            if(err){
                console.log("err",err);
                return res.status(500);
            }
        const Item = {
            productId: row.id,
            name: row.name,
            image: `http://localhost:${PORT}/${row.image}`,
            priceCents: row.price_cents,
            ratingStar:row.rating_stars,
            ratingCount:row.rating_count,
        };
        return res.status(200).json({"Messase":"data retrived",Item});
        }
    )

}
)
function getDate(daysAgo) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const date = new Date();
        date.setDate(date.getDate() + daysAgo);
        const day = date.getDate();
        const month = date.getMonth();
        const nameDay = date.getDay();
        return `${dayNames[nameDay]}, ${monthNames[month]} ${day}`;

    }

app.post('/api/cart', mustBeLoggedIn, (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const checkSql = "SELECT * FROM cart WHERE user_id = ? AND product_id = ?";
    db.get(checkSql, [userId, productId], (err, row) => {
        if (err) { return callError(err) };
        if (row) {
            const newQty = row.quantity + Number(quantity);
            db.run("UPDATE cart SET quantity = ? WHERE cart_id = ?", [newQty, row.cart_id], (err) => {
                if (err) { return callError(err) };

                res.json({ message: "Quantity updated" });
            });
        } else {
            const date = getDate(6); 
            const insertSql = "INSERT INTO cart ( user_id,product_id,quantity,date,shipping) VALUES(?,?,?,?,?)";
            db.run(insertSql, [userId, productId, quantity,date,0], function (err) {
                if (err) { return callError(err) };
                res.json({ message: "Added to cart", id: this.lastID });
            });
        }
    });
});

app.put('/api/cart/option',(req,res)=>{
    const date = req.body[0];
    const productId = req.body[1];
    const shipping= req.body[2];
    const userId= req.body[3];
    console.log(date);

    

    db.run(
        'UPDATE cart SET date = ?,shipping = ? WHERE product_id = ? AND user_id = ?',
        [date,shipping,productId,userId],
        function(err){
            if(err){
                console.log(err);
                return res.json({message:"err0r"});
            }
            console.log("executed");
            res.json({message:"updated"});
        }
    )
    
})
app.get('/api/cart', mustBeLoggedIn, (req, res) => {

    const userId = req.user.id;
    // console.log(userId);
    const sql = `
    SELECT cart.*, products.* FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?`;

    db.all(sql, [userId], (err, rows) => {
        if (err) {return res.status(500).json({ error: err.message })};

        const cartItems = rows.map(row => ({
            cartId: row.cart_id,
            productId: row.id,
            name: row.name,
            image: `http://localhost:${PORT}/${row.image}`,
            priceCents: row.price_cents,
            quantity: row.quantity,
            shipping:row.shipping,
            id: userId,
        }));

        res.json(cartItems);
    })
})
app.delete("/api/cart/:id/:product", (req, res) => {
    const productId = req.params.product;
    const Id = req.params.id;

    console.log("User:", Id);
    console.log("Product:", productId);

    db.run(
        "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
        [Id, productId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            console.log("Rows deleted:", this.changes);

            res.status(200).json({ message: "Item deleted successfully" });
        }
    );
});

app.put("/api/cart/:itemCount/:productId/:userId", (req, res) => {
    const itemCount = req.params.itemCount;
    const productId = req.params.productId;
    const userId = req.params.userId;
    console.log(itemCount, productId, userId);
    console.log(
        `UPDATE cart SET quantity=${itemCount} WHERE product_id=${productId} AND user_id=${userId}`
    );
    db.run(
        "UPDATE cart SET quantity = ? WHERE product_id = ? AND user_id = ?",
        [itemCount, productId, userId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            console.log("Rows Updated :", this.changes);

            return res.status(200).json({ message: "Item Updated successfully" });
        }
    );
})



app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
