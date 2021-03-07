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
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept');
    response.setHeader('Access-Control-Allow-Methods', 'PUT');
    next();
});

//connect to mongodb database client
const MongoClient = require("mongodb").MongoClient;
//create mongodb database instance
let database;
//connect to the cluster
MongoClient.connect("mongodb+srv://lawrence:lawrence2020@cluster0.sw51v.mongodb.net", (err, client) => {
    //make connection to specified database
    database = client.db("lessonsStore");
});

//create a parameter for collection
server.param("collection", (request, response, next, collection) => {
    request.collection = database.collection(collection);
    console.log("collection name:", request.collection);
    return next();
});

//root path request
server.get("/", (request, response, next) => {
    response.render("index.html");
    next();
});

// routing middleware to retrieve all the items in each of the collection
server.get("/:collection", (request, response, next) => {
    request.collection.find({}).toArray((e, result) => {
        if (e) return next(e);
        response.send(result);
    })
});

//routing middleware to retrieve db items by their object ID
server.get("/:collection/:name/:phone", (request, response, next) => {
    request.collection.find({
        name: (request.params.name),
        phone: (request.params.phone)
    }).toArray((error, result) => {
        if (error) return next(error);
        response.send(result);
    })
});

//middleware to post records to each of the collection
server.post("/:collection", (request, response, next) => {
    request.collection.insert(request.body, (err, result) => {
        if (err) return next(err);
        response.send(result.ops);
    });
})

//run the server
server.listen(port, function () {
    console.log(`server is running on port ${port}`);
})