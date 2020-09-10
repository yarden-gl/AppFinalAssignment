// import data from '../data';
const data  = require('../data.js').default;
const redis = require('redis');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const CryptoJS = require("crypto-js");
const redisClient = redis.createClient();
const moment = require('moment');
let RedisStore = require('connect-redis')(session)
const serverError = 'Internal server error';
const CryptoSalt = 'very secret stuff';

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'very secrety string',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 30 * 60 // 30 minutes default
    }
}))

redisClient.on("error", (error) => {
    console.log("error")
    console.error(error);
});

// Parsing middleware for post requests mainly
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// crypto functionaility for password storage
function encrypter(data) {
    try {
        return CryptoJS.AES.encrypt(JSON.stringify(data), CryptoSalt).toString();
    } catch (error) {
    }
}
function decrypter(ciphertext) {
    try {
        let bytes = CryptoJS.AES.decrypt(ciphertext, CryptoSalt);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)); 
    } catch (error) {
    }
}

// adding admin user on load
redisClient.HSET("users", "admin", encrypter("admin"), (err, reply) => {
    if (!err) { console.log("added admin user successfully") }
})

//---------------------------- Get Requests ----------------------------

app.get("/isadmin", (req, res) => {
    if (req.session.username == "admin") {
        res.send(true)
    } else { res.send(false) }
});

// returns array of all user names
app.get("/allusers", (req, res) => {
    if (req.session.username != 'admin') { res.status(403).send('forbidden, please login') }
    else {
        redisClient.HKEYS("users", (err, reply) => {
            if (err) { res.status(500).send(serverError); }
            res.status(200).send(reply);
        })
    }
});
// returns an object with time:action 
app.get("/userlog/:username", (req, res) => {
    if (req.session.username != 'admin') { res.status(403).send('forbidden, please login') }
    else {
        redisClient.HGETALL(req.params.username + "-log", (err, reply) => {
            if (err) { res.status(500).send(serverError); }
            res.status(200).send(reply);
        })
    }
});

// Returns all products to display in HomeScreen 
app.get("/api/products", (req, res) => {
    if (!req.session.username) { res.status(403).send('forbidden, please login') }
    else {
        res.send(data.products);
    }
});

// Returns products in current order to display in cart
app.get("/api/cart", (req, res) => {
    if (!req.session.username) { res.status(403).send('forbidden, please login') }
    else {
        let userName = req.session.username;
        let userCart;
        let allProducts = data.products
        redisClient.HGETALL(userName + "-cart", (err, reply) => {
            if (err) { res.status(500).send(serverError); }
            userCart = reply;
            if (userCart) {
                let addedProductIds = Object.keys(userCart);
                let results = allProducts.filter(allProducts => addedProductIds.includes(allProducts._id));
                for (var i in results) {
                    results[i].quantity = userCart[results[i]._id];
                }
                res.status(200).send(results);
            } else {
                res.status(200).send([]);
            }
        })
    }
});

// Returns products that fit the given search parameter
app.get("/api/search/", (req, res) => {
    if (!req.session.username) { res.status(403).send('forbidden, please login') }
    else {
        res.send(data.products);
    }
});

// Returns products that fit the given search parameter
app.get("/api/search/:parameter", (req, res) => {
    if (!req.session.username) { res.status(403).send('forbidden, please login') }
    else {
        let parameter = req.params.parameter;
        parameter = parameter.toLowerCase();
        let newArr = data.products.filter(function (item) {
            let name = item.name.toLowerCase();
            let brand = item.brand.toLowerCase();
            let category = item.category.toLowerCase();
            return name.includes(parameter) || brand.includes(parameter) || category.includes(parameter);
        });
        res.send(newArr);
    }
});

//---------------------------- Post Requests ----------------------------

// Add product with :productId to cart and set quantity to 1
app.post('/cart/:productid', (req, res) => {
    if (!req.session.username) { res.status(403).send('forbidden, please login') }
    else {
        let userName = req.session.username;
        let product = req.params.productid;
        redisClient.hincrby(userName + "-cart", product, 1, (err, reply) => {
            if (err) { res.status(500).send(serverError) }
            redisClient.HSET(req.session.username + "-log", moment().format(),
                `add product #${req.params.productid} to cart`, (err, reply) => {
                    if (err) { res.status(500).send(serverError); }
                });
            res.status(200).end();
        })
    }
});

// TODO  --> admin updates a product. Need to change data.js file
app.post('/updateproduct/:productid', (req, res) => {
    try {
        redisClient.hset(userName + "-cart", product, 1, (err, reply) => {
            if (err) { res.status(500).send(serverError) }
            res.status(200).end();
        })
        console.log(`User made order of ${req.body.amount} nis`);
        res.end();
    } catch (error) {
    }
});

// Set product's quantity to :quantity in cart
app.post('/cart-quantity/:productid/:quantity', (req, res) => {
    try {
        if (!req.session.username) { res.status(403).send('forbidden, please login') }
        else {
            let userName = req.session.username;
            console.log("inside quantity route")
            redisClient.hset(userName + "-cart", req.params.productid, req.params.quantity, (err, reply) => {
                if (err) { throw err }
                res.status(200).end();
            })
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/cart/remove/:productid', (req, res) => {
    try {
        if (!req.session.username) { res.status(403).send('forbidden, please login') }
        else {
            let userName = req.session.username;
            let allProducts = data.products;
            redisClient.hdel(userName + "-cart", req.params.productid, (err, reply) => {
                if (err) { throw err };
                redisClient.HGETALL(userName + "-cart", (err, userCart) => {
                    if (err) { throw err };
                    if (userCart) {
                        let addedProductIds = Object.keys(userCart);
                        let results = allProducts.filter(allProducts => addedProductIds.includes(allProducts._id));
                        redisClient.HSET(req.session.username + "-log", moment().format(),
                            `remove product #${req.params.productid} from cart`, (err) => {
                                if (err) { throw err };
                            });
                        res.status(200).send(results);
                    } else {
                        res.status(200).send([]);
                    }
                })
            })
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/signin', (req, res) => {
    try {
        redisClient.hget("users", req.body.username, (err, reply) => {
            console.log(req.body)
            if (req.body.password == decrypter(reply)) {
                req.session.username = req.body.username;
                redisClient.HSET(req.session.username + "-log", moment().format(), "logged in", (err, reply) => {
                    if (err) { res.status(500).send(serverError); }
                });
                if (req.body.remember) {
                    req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year
                }
                res.status(200).end();
            } else {
                res.status(404).send('User not found');
            }
        })
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/register', (req, res) => {
    try {
        // check if username already exists
        redisClient.HEXISTS("users", req.body.username, (err, reply) => {
            if (reply == 1) { res.status(409).end(); }
        })
        redisClient.hset("users", req.body.username, encrypter(req.body.password), (err, reply) => {
            if (err) { throw err }
            req.session.username = req.body.username;
            if (req.body.remember) {
                req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year
            }
            res.status(201).end();
        })
    } catch (error) {
        res.status(500).send(error);
    }
});

// TODO: logic for checking out
app.post('/checkout', (req, res) => {
    console.log(`User made order of ${req.body.amount} nis`);
    res.end();
});

// creates shipping value under user name table
app.post('/updateshipping', (req, res) => {
    try {
        if (!req.session.username) { res.status(403).send('forbidden, please login') }
        else {
            let userName = req.session.userame;
            redisClient.HSET(userName, "shipping", JSON.stringify(req.body), (err) => {
                if (err) { throw err }
            })
        }
    } catch (error) {
        res.status(500).send(error);
    }
})

app.get('/getshipping', (req, res) => {
    try {
        if (!req.session.username) { res.status(403).send('forbidden, please login') }
        else {
            let userName = req.session.userame;
            redisClient.HGET(userName, "shipping", (err, reply) => {
                if (err) { throw err }
                res.status(200).send(JSON.parse(reply));
            })
        }
    } catch (error) {
        res.status(500).send(error);
    }
})

app.delete('/logout', (req, res) => {
    try {
        let userName = req.session.username;
        req.session.destroy((err) => {
            res.clearCookie('connect.sid', { path: '/' });
            console.log(`User ${userName} session killed`);
            redisClient.HSET(userName + "-log", moment().format(),
                `logged out`, (err, reply) => {
                    if (err) { throw err }
                });
            res.end();
        })
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(5000, () => {
    console.log(`Server started at http://localhost:5000`);
});

module.exports = app;