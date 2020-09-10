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
const forbiddenError = 'forbidden, please login';
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
    try {
        if (req.session.username == "admin") {
            res.send(true)
        } else { res.send(false) }
    } catch (error) {
        console.log(error)
    }
});

// returns array of all user names
app.get("/allusers", (req, res) => {
    if (req.session.username != 'admin') { res.status(403).send(forbiddenError) }
    else {
        redisClient.HKEYS("users", (err, reply) => {
            if (err) { res.status(500).send(serverError); }
            res.status(200).send(reply);
        })
    }
});

// returns an object with the user logs in time:action format
app.get("/userlog/:username", (req, res) => {
    if (req.session.username != 'admin') { res.status(403).send(forbiddenError) }
    else {
        redisClient.HGETALL(req.params.username + "-log", (err, reply) => {
            if (err) { res.status(500).send(serverError); }
            res.status(200).send(reply);
        })
    }
});

// Returns all products to display in HomeScreen 
app.get("/api/products", (req, res) => {
    if (!req.session.username) { res.status(403).send(forbiddenError) }
    else {
        res.send(data.products);
    }
});

// Returns products in current order to display in cart
app.get("/api/cart", (req, res) => {
    if (!req.session.username) { res.status(403).send(forbiddenError) }
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

// Returns products that fit search parameter
app.get("/api/search/", (req, res) => {
    if (!req.session.username) { res.status(403).send(forbiddenError) }
    else {
        res.send(data.products);
    }
});

// Returns products that fit the given search parameter
app.get("/api/search/:parameter", (req, res) => {
    if (!req.session.username) { res.status(403).send(forbiddenError) }
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

// Add product with :productId to user cart and set quantity to 1
app.post('/cart/:productid', (req, res) => {
    if (!req.session.username) { res.status(403).send(forbiddenError) }
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

// admin updates a product. Changes to apply saved in redis
app.post('/updateproduct/:productid', (req, res) => {
    console.log(req.body)
    try {
        redisClient.hset("update products", req.params.productid, JSON.stringify(req.body), (err, reply) => {
            if (err) { res.status(500).send(serverError) }
            res.status(200).end();
        })
    } catch (error) {
        res.status(500).send(error)
    }
});

// Set product's quantity to :quantity in user cart
app.post('/cart-quantity/:productid/:quantity', (req, res) => {
    try {
        if (!req.session.username) { res.status(403).send(forbiddenError) }
        else {
            let userName = req.session.username;
            redisClient.hset(userName + "-cart", req.params.productid, req.params.quantity, (err, reply) => {
                if (err) { throw err }
                res.status(200).end();
            })
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// remove cart from redis db according to product id
app.post('/cart/remove/:productid', (req, res) => {
    try {
        if (!req.session.username) { res.status(403).send(forbiddenError) }
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

// sign in with remember me trigerring 1 year cookie maxage
app.post('/signin', (req, res) => {
    try {
        redisClient.hget("users", req.body.username, (err, reply) => {
            if (req.body.password == decrypter(reply)) {
                req.session.username = req.body.username;
                redisClient.HSET(req.session.username + "-log", moment().format(), "logged in", (err, reply) => {
                    if (err) { throw err }
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

// register a new user, encrypt the password, return 409 if exists
app.post('/register', (req, res) => {
    try {
        // check if username already exists
        redisClient.HEXISTS("users", req.body.username, (err, reply) => {
            if (err) { throw err }
            if (reply == 1) { res.status(409).send('Username already exists'); }
            else {
                redisClient.hset("users", req.body.username, encrypter(req.body.password), (err, reply) => {
                    if (err) { throw err }
                    req.session.username = req.body.username;
                    if (req.body.remember) {
                        req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year
                    }
                    res.status(201).end();
                })
            }
        })
    } catch (error) {
        res.status(500).send(error);
    }
});

// checkout + log the action + delete the user cart.
app.post('/checkout', (req, res) => {
    let userName = req.session.username;
    try {
        redisClient.HSET(userName + "-log", moment().format(),
        `place order for ${req.body.amount} nis`, (err) => {
            if (err) { throw err };
            redisClient.DEL(userName + "-cart", (reply, err) =>{
                if (err) { throw err };
            });
        });
        res.end();
    } catch (error) {
        res.status(500).send(error);
    }
});

// add shipping details for user under shipping table
app.post('/updateshipping', (req, res) => {
    let userName = req.session.username;
    try {
        if (!userName) { res.status(403).send(forbiddenError) }
        else {
            redisClient.HSET("shipping-details", userName, JSON.stringify(req.body), (err) => {
                if (err) { throw err }
            })
            res.status(201).end();
        }
    } catch (error) {
        res.status(500).send(error);
    }
})

// returns shipping details of user and populates in the form
app.get('/getshipping', (req, res) => {
    let userName = req.session.username;
    try {
        if (!userName) { res.status(403).send(forbiddenError) }
        else {
            redisClient.HGET("shipping-details", userName, (err, reply) => {
                if (err) { throw err }
                res.status(200).send(JSON.parse(reply));
            })
        }
    } catch (error) {
        res.status(500).send(error);
    }
})

// destroys the session on the server and also clears the user cookie
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
            res.status(200).end();
        })
    } catch (error) {
        res.status(500).send(error);
    }
});

// for test purposes, deleting users
app.delete('/deleteuser', (req, res) => {
    try {
            redisClient.HDEL("users", "testuser", (err, reply) =>{
                if (err) { throw err }
                if (reply == 1) res.status(200).end()
                else {
                    res.status(404).send('user not found')
                }
            })
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(5000, () => {
    console.log(`Server started at http://localhost:5000`);
});

module.exports = app;