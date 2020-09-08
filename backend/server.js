import express from 'express';
import data from '../data';
import redis from 'redis';
import uuid from 'uuid';
const app = express();
const client = redis.createClient();
const bodyParser = require('body-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

client.on("error", (error) => {
    console.log("error")
    console.error(error);
});

// Parsing middleware for post requests mainly
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

//---------------------------- Session Management ----------------------------

/** Taken from calcExpress
 * 
let arrSessions = []; // Redis should save the sessions
  
app.use(session({
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));

//<GET> /start  starts a new session and returns a unique string
app.get('/start', (req, res, next) => {
    if(!req.session.uniqustring) {
        req.session.uniqustring = uuid.v4();
        let newSession = {
            uniquString: req.session.uniqustring,
        };
        arrSessions.push(newSession);
    } 
    res.send(`${req.session.uniqustring}`);
    console.log(arrSessions);
});
 */

//---------------------------- Get Requests ----------------------------

// Returns all products to display in HomeScreen 
app.get("/api/products", (req, res) => {
    res.send(data.products);
});

// Returns products in current order to display in cart
app.get("/api/cart", (req, res) => {
    res.send(data.products);
});

// Returns products that fit the given search parameter
app.get("/api/search/", (req, res) => {
    res.send(data.products);
});

// Returns products that fit the given search parameter
app.get("/api/search/:parameter", (req, res) => {
    let parameter = req.params.parameter;
    parameter = parameter.toLowerCase();
    let newArr = data.products.filter(function (item) {
        let name = item.name.toLowerCase();
        let brand = item.brand.toLowerCase();
        let category = item.category.toLowerCase();
        return name.includes(parameter) || brand.includes(parameter) || category.includes(parameter);
    });
    res.send(newArr);
    console.log(`All products that include '${req.params.parameter}' search filter`);
    console.log(newArr);
});

//---------------------------- Post Requests ----------------------------

// Add product with :productId to cart and set quantity to 1
app.post('/currentOrder/:productId', (req, res, next) => {
    /** let currentSession = find(req.params.uniqustring);
 if(currentSession) { // if session with :uniqustring is open
    currentSession.M += parseInt(req.params.num);
    res.send(`${currentSession.M}`);   
} else {
next();
} */
    let whichUser = "yarden"
    client.hincrby(whichUser + "-cart", req.body.productId, 1, (err, reply) => {
        if (err) { res.send(500) }
        res.status(200);
        // here we need redirect or response for react
    })
    res.send("Product added to cart");
    console.log(`Add product ${req.params.productId} to cart`);
});

// Set product's quantity to :quantity in cart
app.post('/currentOrder/:productId/:quantity', (req, res, next) => {
    console.log(`Quantity of product ${req.params.productId} in cart is ${req.params.productId}`);
    let whichUser = "yarden"
    client.hset(whichUser + "-cart", req.body.productId, 1, (err, reply) => {
        if (err) { res.send(500) }
        res.status(200);
        // here we need redirect or response for react
    })
});

app.post('/currentOrder/:productId/remove', (req, res) => {
    let whichUser = "yarden"
    client.hdel(whichUser + "-cart", req.body.productId,(err, reply) => {
        if (err){res.send(500)}
        res.status(200);
        // here we need response for react
    })
    console.log(`Remove product ${req.params.productId} from cart`);
});

app.listen(5000, () => {
    console.log(`Server started at http://localhost:5000`);
});
