import express from 'express';
import data from '../data';
import redis from 'redis';
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const CryptoJS = require("crypto-js");
const redisClient = redis.createClient();
let RedisStore = require('connect-redis')(session)
const serverError = 'Internal server error';

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

app.get("/isadmin", (req, res) => {
    // if (!req.session.username){ res.status(403).send('forbidden, please login')}
    if (req.session.username == "admin"){
        res.send(true)
    } else { res.send(false)}
});

// Done
// Returns all products to display in HomeScreen 
app.get("/api/products", (req, res) => {
    // if (!req.session.username){ res.status(403).send('forbidden, please login')}
    res.send(data.products);
});

// Returns products in current order to display in cart
app.get("/api/cart", (req, res) => {
    // if (!req.session.username){ res.status(403).send('forbidden, please login')}
    let userName = req.session.username;
    let userCart;
    let allProducts = data.products
    redisClient.HGETALL(userName + "-cart", (err, reply) => {
        if (err) { res.status(500).send(serverError); }
        userCart = reply;
        if (userCart){
            let addedProductIds = Object.keys(userCart);
            let results = allProducts.filter(allProducts => addedProductIds.includes(allProducts._id));
            for (var i in results) {
                 results[i].quantity = userCart[results[i]._id];
            }
            console.log("in api cart");
            res.status(200).send(results);
        } else {
            res.status(200).send([]);
        }
    })
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
    redisClient.hincrby(userName + "-cart", product, 1, (err, reply) => {
        if (err) { res.status(500).send(serverError) }
        res.status(200).end();
    })
});

// TODO  --> admin updates a product. Need to change data.js file
app.post('/updateProduct/:productId', (req, res) => {
    redisClient.hset(userName + "-cart", product, 1, (err, reply) => {
        if (err) { res.status(500).send(serverError) }
        res.status(200).end();
    })
    console.log(`User made order of ${req.body.amount} nis`);
    res.end();
});

// Set product's quantity to :quantity in cart
app.post('/cart-quantity/:productId/:quantity', (req, res) => {
    // if (!req.session.username){ res.status(403).send('forbidden, please login')}
    let userName = req.session.username;
    let allProducts = data.products;
    console.log("inside quantity route")
    redisClient.hset(userName + "-cart", req.params.productId, req.params.quantity, (err, reply) => {
        if (err) { res.status(500).send(serverError); }
        res.status(200).end();
    })
});

app.post('/cart/remove/:productId', (req, res) => {
    // if (!req.session.username){ res.status(403).send('forbidden, please login')}
    let userName = req.session.username;
    let allProducts = data.products;
        redisClient.hdel(userName + "-cart", req.params.productId, (err, reply) => {
        if (err) { res.status(500).send(serverError) }
         redisClient.HGETALL(userName + "-cart", (err, userCart) => {
            if (err) { res.status(500).send(serverError); }
            if (userCart){
                let addedProductIds = Object.keys(userCart);
                let results = allProducts.filter(allProducts => addedProductIds.includes(allProducts._id));
                res.status(200).send(results);
            } else {
                res.status(200).send([]);
            }
        })
         
    })
});

app.post('/signin', (req, res) => {
    redisClient.hget("users", req.body.username, (err, reply) => {
        if (err) { res.status(500).send(serverError); }
        if (req.body.password == decrypter(reply)) {
            req.session.username = req.body.username;
            res.status(200).end();
        } else {
            res.status(404).send('User not found'); 
        }
    })
});

app.post('/register', (req, res) => {
    console.log(`User with username ${req.body.username} and password ${req.body.password} registered`);
    // check if username already exists
    redisClient.HEXISTS("users", req.body.username, (err, reply) => {
        if (err) { res.status(500).send(serverError); }
        if (reply == 1) { res.status(409).end(); }
    })
    redisClient.hset("users", req.body.username, encrypter(req.body.password), (err, reply) => {
        if (err) { res.status(500).send(serverError); }
        req.session.username = req.body.username;
        res.status(201).end();
    })
    console.log(req.body);
});

// TODO: logic for checking out
app.post('/checkout', (req, res) => {
    console.log(`User made order of ${req.body.amount} nis`);
    res.end();
});

app.post('/shippingDetails', (req, res) => {
    let userName = req.session.userame;
    redisClient.HSET(userName, "shipping", JSON.stringify(req.body), (err)=>{
        if(err) {res.status(500).send(serverError)}
    })
})

app.delete('/logout', (req, res) => {
    let userName = req.session.username;
    req.session.destroy((err) => {
        res.clearCookie('connect.sid', { path: '/' });
        console.log(`User ${userName} session killed`);
        res.end();
    })
});

app.listen(5000, () => {
    console.log(`Server started at http://localhost:5000`);
});

module.exports = app;