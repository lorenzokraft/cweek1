//import express module
const express = require("express");
//create express instance
const server = express();

//configure express
server.use(express.json());
//configure where to get the servers static files
server.use(express.static('public'));
//specify the port to run the server
const port = process.env.PORT || 8000;
//set all http headers
server.use((request, response, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept');
    res.setHeader('Access-Control-Allow-Methods', 'PUT');
    next();
});

//connect to mongodb database client
const MongoClient = require("mongodb").MongoClient;
//create mongodb database instance
let datbase;
