import express from 'express';
import data from '../data';
import redis from 'redis';
const app = express();
//const redis = require("redis");
const client = redis.createClient();
const bodyParser = require('body-parser');

var order = {products: []};

app.get("/api/products", (req,res) => {
    res.send(data.products);
});

app.get("/api/cart", (req,res) => {
    res.send(data.products);
});

client.hset("yarden-cart", "leash", "1");

app.get("/demo1", (req,res) => {
    client.hgetall("yarden-cart", (err, reply) => {
        res.send(reply);
    });
});

app.post("/demo2", (req,res) => {
    client.hgetall("yarden-cart", (err, reply) => {
        res.send(reply);
    });
});

// Parsing middleware for post requests mainly
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

client.on("error", (error) => {
    console.log("error")
    console.error(error);
});

app.listen(5000, () => {
    console.log(`Server started at http://localhost:5000`);
  });
