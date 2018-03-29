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




// Set up get, post, put, and delete routes
// Set jsonParser as middleware for POST and PUT routes, so that req.body can be accessed for JSON
// Declare and assign doc and docId vars in each route, as relevant, with request data
// Open bucket in each route

app.use(jsonParser);

app.get("/customers/:id", function(request, response){



});

app.post("/customers", jsonParser, function(request, response) {



});

app.put("/customers/:id", jsonParser, function(request, response){

  /*
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

  */

});

app.delete("/customers/:id", function(request, response){

  /*
    var docId = request.params.id;

    // Delete document with specified docId
    bucket.remove(docId, function(err, rows){
        if(err) {
            response.json(err);
        } else {
            response.json(rows);
        }
    });

  */

});

app.listen(port, function(err){
    console.log("Customer360 running on port:", port);;
});


