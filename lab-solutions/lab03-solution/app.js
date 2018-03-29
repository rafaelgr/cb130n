// Require express and body-parser for JSON handling

var couchbase = require("couchbase");
var express = require("express");
var bodyParser = require('body-parser');
var uuid = require("node-uuid");

// Create cluster, app, and jsonParser objects

var cluster = new couchbase.Cluster("localhost:8091");
var app = express();
var jsonParser = bodyParser.json();

// Set port, password, and bucketName variables

var port = process.env.port || 3000;
var bucketName = "Customer360";
var password = "password";

// Open Customer360 bucket and create reference for use in routes

var bucket = cluster.openBucket(bucketName, password, function(err){
  console.log("Customer360 bucket open");
});

// Set up get, post, put, and delete routes
// Set jsonParser to be used as middleware for all routes, so req.body is accessible for POST and PUT
// Declare and assign doc and docId vars in each route, as relevant, with request data
// Open bucket in each route

app.use(jsonParser);

app.get("/customers/:id", function(request, response){

    var docId = request.params.id;

    // 8. Get document by Id, returning rows.value as JSON, or 404 with JSON error "no matching id" object
    bucket.get(docId, function(err, rows){
     if(err) {
         response.status(404).json({"error": "No match for " + docId});
     } else {
         response.json(rows.value);
     }
    });

});

app.post("/customers", function(request, response) {

    var doc = request.body;
    var docId = "an-example-key";
    // var docId = "customer::" + uuid.v4();

    // Insert document with key (docId), repeating insert to show error, replace with Upsert
    bucket.insert(docId, doc, function(err, rows){ 
    // bucket.upsert(docId, doc, function(err, rows){
     if(err) {
         response.json(err);
     } else {
         response.json(rows);
     }
    });

});

app.put("/customers/:id", function(request, response){

    var doc = request.body;
    var docId = request.params.id;

    // Replace put document with new document for the existing docId, show error if no doc to replace
    bucket.replace(docId, doc, function(err, rows){
     if(err) {
         response.json(err);
     } else {
         response.json(rows);
     }
    });

});

app.delete("/customers/:id", function(request, response){

    var docId = request.params.id;

    // Delete document with specified docId
    bucket.remove(docId, function(err, rows){
      if(err) {
          response.json(err);
      } else {
          response.json(rows);
      }
    });

});

app.listen(port, function(err){
    console.log("Customer360 running on port:", port);;
});


