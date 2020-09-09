import express from 'express';
import data from '../data';
import redis from 'redis';
import uuid from 'uuid';
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const CryptoJS = require("crypto-js");
const redisClient = redis.createClient();
let RedisStore = require('connect-redis')(session)

app.set('trust proxy', 1);
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
    return CryptoJS.AES.encrypt(JSON.stringify(data), 'very secrety this').toString();
}
function decrypter(ciphertext) {
    let bytes = CryptoJS.AES.decrypt(ciphertext, 'very secrety this');
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

// adding admin user on load
redisClient.HSET("users", "admin", encrypter("admin"), (err, reply)=>{
    if(!err) {console.log("added admin user successfully")}
})

//---------------------------- Get Requests ----------------------------

// Returns all products to display in HomeScreen 
app.get("/api/products", (req, res) => {
    // if (!req.session.username){ res.status(403).send('forbidden, please login')}
    res.send(data.products);
});

// Returns products in current order to display in cart
app.get("/api/cart", (req, res) => {
    // if (!req.session.username){ res.status(403).send('forbidden, please login')}
    let userName = req.session.username;
    redisClient.HGETALL(userName + "-cart", (err, reply) => {
        if (err) { res.status(500).send('Internal server error'); }
        res.send(reply).end();
    })
    console.log(req.session.username);
    console.log(req.session);
    console.log(req.session.id);
});

// Returns products that fit the given search parameter
app.get("/api/search/", (req, res) => {
    // if (!req.session.username){ res.status(403).send('forbidden, please login')}
    res.send(data.products);
});

// Returns products that fit the given search parameter
app.get("/api/search/:parameter", (req, res) => {
    // if (!req.session.username){ res.status(403).send('forbidden, please login')}
    let parameter = req.params.parameter;
    parameter = parameter.toLowerCase();
    let newArr = data.products.filter(function (item) {
        let name = item.name.toLowerCase();
        let brand = item.brand.toLowerCase();
        let category = item.category.toLowerCase();
        return name.includes(parameter) || brand.includes(parameter) || category.includes(parameter);
    });
    res.send(newArr);
});

//---------------------------- Post Requests ----------------------------

// Add product with :productId to cart and set quantity to 1
app.post('/cart/:productId', (req, res) => {
    // if (!req.session.username){ res.status(403).send('forbidden, please login')}
    let userName = req.session.username;
    let product = req.params.productId;
    client.hincrby(userName + "-cart", product, 1, (err, reply) => {
        if (err) { res.status(500).send('Internal server error') }
        res.status(200).send(`Product ${product} added to cart`);
    })
});

// TODO
app.post('/updateProduct/:productId', (req, res) => {
    client.hset(userName + "-cart", product, 1, (err, reply) => {
        if (err) { res.status(500).send('Internal server error') }
        res.status(200).send(`Product ${product} added to cart`);
        // here we need redirect or response for react
    })
    console.log(`User made order of ${req.body.amount} nis`);
    res.end();
});

// Set product's quantity to :quantity in cart
app.post('/cart/:productId/:quantity', (req, res) => {
    // if (!req.session.username){ res.status(403).send('forbidden, please login')}
    let userName = req.session.username;
    client.hset(userName + "-cart", req.params.productId, req.params.quantity, (err, reply) => {
        if (err) { res.send(500) }
        res.status(200).send(`added to ${username}'s cart
        product ${req.params.productId} with quantity ${req.params.quantity}`);
    })
});

app.post('/cart/:productId/remove', (req, res) => {
    // if (!req.session.username){ res.status(403).send('forbidden, please login')}
    let userName = req.session.username;
        client.hdel(userName + "-cart", req.params.productId, (err, reply) => {
        if (err) { res.send(500) }
        res.status(200).send(`removed ${req.params.productId} from ${username}'s cart`);
    })
});

// DONE?
app.post('/signin', (req, res) => {
    redisClient.hget("users", req.body.username, (err, reply) => {
        if (err) { res.status(500).send('Internal server error'); }
        if (req.body.password == decrypter(reply)) {
            console.log(reply);
            req.session.username = req.body.username;
            console.log(req.session)
            console.log(req.body)
            res.status(200).send(`Hi ${req.body.username}! You are now signed in`);
            res.end();
        } else {
            res.status(404).send('User not found'); 
        }
    })
});

// DONE?
app.post('/register', (req, res) => {
    console.log(`User with username ${req.body.username} and password ${req.body.password} registered`);
    // check if username already exists
    redisClient.HEXISTS("users", req.body.username, (err, reply) => {
        if (err) { res.status(500).send('Internal server error'); }
        if (reply == 1) { res.status(409).send(`Username ${req.body.username} exists`); }
    })
    redisClient.hset("users", req.body.username, encrypter(req.body.password), (err, reply) => {
        if (err) { res.status(500).send('Internal server error'); }
        res.status(201).send(`Hi ${req.body.username}! You are now registered`)
    })
});

// Need to randomly generate and save orderId
app.post('/checkout', (req, res) => {
    console.log(`User made order of ${req.body.amount} nis`);
    res.end();
});

app.listen(5000, () => {
    console.log(`Server started at http://localhost:5000`);
});

module.exports = app;