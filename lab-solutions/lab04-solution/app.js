// Require couchbase, express, body-parser, and node-uuid

var couchbase = require("couchbase");
var express = require("express");
var bodyParser = require('body-parser');
var uuid = require("node-uuid");

// Create cluster, app, and jsonParser objects

var cluster = new couchbase.Cluster("localhost:8091");
var app = express();
var jsonParser = bodyParser.json();

// Create reference to N1qlQuery object

var n1qlQuery = couchbase.N1qlQuery;

// Set port, password, and bucketName variables

var port = process.env.port || 3000;
var bucketName = "Customer360";
var password = "password";

// Open bucket and create bucket reference for use in routes

var bucket = cluster.openBucket(bucketName, password, function(err){
  console.log("Customer360 bucket opened");
});

// Set up get, post, put, and delete routes
// Set jsonParser as middleware for POST and PUT routes, so that req.body can be accessed for JSON
// Declare and assign doc and docId vars in each route, as relevant, with request data
// Open bucket in each route

app.get("/country/:id", function(request, response){

  var docId = request.params.id;

  // Create query to SELECT specific document by its key, using relevant placeholder, pass query to 
  // bucket with reference for placeholder value(s), return err or rows as JSON, with appropriate status

  var query = n1qlQuery.fromString("SELECT * FROM Customer360 USE KEYS ($1)");

  bucket.query(query, [docId], function(err, rows){
    if (err) {
      response.status(404).json({"error": err});
    } else if (rows.length == 0) {
      response.status(200).json({"status": "No document matched " + docId});
    } else {
      response.status(200).json(rows);
    }
  });

});

app.get("/customers/:code", function(request, response){

  var code = request.params.code;

  // Create query to SELECT documents, filtered by a value using relevant placeholder, pass query to 
  // bucket with reference for placeholder value(s), return err or rows as JSON, with appropriate status

  var query = n1qlQuery.fromString(
      "SELECT firstName, lastName, billingAddress " + 
      "FROM Customer360 " + 
      "WHERE type = 'customer' AND billingAddress.country = $1");

  bucket.query(query, [code], function(err, rows){
    if (err) {
      response.status(404).json({"error": err});
    } else if (rows.length == 0) {
      response.status(200).json({"status": "No document matched " + code});
    } else {
      response.status(200).json(rows);
    }
  });

});

app.post("/customers", jsonParser, function(request, response) {

  // docId = "customer::" + uuid.v4();
  var docId = "an-example-key";
  var doc = request.body;

  // Create query to INSERT document posted in request body using specified document ID (key), pass query to 
  // bucket with reference for placeholder value(s), return err or rows as JSON, with appropriate status

  var query = n1qlQuery.fromString("INSERT INTO Customer360 (KEY, VALUE) VALUES ($1, $2)")

  bucket.query(query, [docId, doc], function(err, rows){ 
    if(err) {
      response.json(err);
    } else {
      response.json(rows);
    }
  });

});

app.put("/customers/:id", jsonParser, function(request, response){

  var docId = request.params.id;
  var firstName = request.body.firstName;
  var lastName = request.body.lastName;

  // Create query to UPDATE existing document using values posted in request body and document ID (key)
  // set on URL, pass query to bucket with reference for placeholder value(s), return err or rows as JSON, 
  // with appropriate status

   var query = n1qlQuery.fromString("UPDATE Customer360 USE KEYS($1) SET firstName = $2, lastName = $3");

   bucket.query(query, [docId, firstName, lastName], function(err, rows){
     if(err) {
        response.json(err);
     } else {
        response.json(rows);
     }
   });

});

app.delete("/customers/:id", function(request, response){

  var docId = request.params.id;

  // Create query to DELETE document specified by document ID (key) set on URL, pass query to 
  // bucket with reference for placeholder value(s), return err or rows as JSON, with appropriate status

  var query = n1qlQuery.fromString("DELETE FROM Customer360 USE KEYS($1)");

  bucket.query(query, [docId], function(err, rows){
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


