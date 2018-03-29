// Require couchbase, express, body-parser, and node-uuid

var couchbase = require('couchbase');
var express = require('express');
var bodyParser = require('body-parser');
var uuid = require('node-uuid');

// Require ottoman and the local .models module

var ottoman = require('ottoman');
var models = require('./models');

// Create app and jsonParser objects

var app = express();
var jsonParser = bodyParser.json();

// Set port variable

var port = process.env.port || 3000;

// Create indices required by models

ottoman.ensureIndices(function(err) {
  if (err) return console.error(err);
});

// Set up get, post, put, and delete routes
// Set jsonParser as middleware for POST and PUT routes, so that req.body can be accessed for JSON
// Declare and assign doc and docId vars in each route, as relevant, with request data
// Open bucket in each route

// GET a Country document by the value specified as its id within the Model
app.get('/country/:id', function(request, response){

  var countryId = request.params.id;

  // Get a Country doc by the id attribute specified in its model. Return err or the document as JSON, 
  // with appropriate status and messages

  models.Country.getById(countryId, function(err, country){
    if (err) {
      response.status(404).json({'error': err});
    } else {
      response.status(200).json(country);
    }

  });

});

// GET a Customer document using a generic find of the value of one of its attributes
app.get('/customers/:code', function(request, response){

  // + Verify Customer model has country attribute defined as a reference to the Country model

  var countryCode = request.params.code;

  // Create reference to a Country document for the requested countryCode

  var country = models.Country.ref(countryCode);

  // Use the country reference, wrapped in JSON structured appropriately for a Customer document,
  // to generically find Customer documents which reference this Country. Return err, a JSON array
  // of customers, or a JSON error message if there are no customers for this country.

  models.Customer.find({
    'billingAddress': {
      'country': country
    }
  }, function(err, customers) {
    if (err) {
      response.status(404).json({'error': err});
    } else if (customers.length == 0) {
      response.status(200).json({'status': 'No document matched ' + countryCode});
    } else {
      response.status(200).json(customers);
    }
  });

});

// POST a new Customer document, first with a referenced Country doc, then an embedded Country doc
app.post('/customers', jsonParser, function(request, response) {

  var customerData = request.body;
  var countryCode = customerData.billingAddress.country;

  // RELATION BY DOCUMENT EMBEDDING
  // + Update Customer model to embed a Country doc as country attribute
  // + Update Country model to define a findByCountryCode index and method
  // + Update app.js to ensure indices are created as specified by Models

  // Use new index method to find a Country document by its countryCode value

  models.Country.findByCountryCode(countryCode, function(err, countries){

    // Assign the first returned Country as the country for customerData. Note, consider how you
    // could alternately use a generic .find() or .findById(), as in the GET operations above.
  
    customerData.billingAddress.country = countries[0];

    // Create a new Customer using the posted data. Return an err or the new Customer document as JSON.

    models.Customer.create(customerData, function(err, customer){
      if(err) {
        response.json(err);
      } else {
        response.json(customer);
      }
    });

  });

});

// PUT updated values in an existing Customer document specified by its document id
app.put('/customers/:id', jsonParser, function(request, response){

  // + Verify Customer model has country attribute defined as embedded, not referenced

  var customerId = request.params.id;
  var customerDoc = request.body;

  // Get Customer model by the provided id

  models.Customer.getById(customerId, function(err, customer){

    if(err) { response.json(err); return };

    // Update the returned Customer model with new values from PUT request



    // Save updated values in Customer model



  });

});

// DELETE a Customer document based on its document id
app.delete('/customers/:id', function(request, response){

  var customerId = request.params.id;

  // Get Customer model by the provided id

  models.Customer.getById(customerId, function(err, customer){

    if(err) { response.json(err); return };

    // Remove this Customer model

 

  });

});

app.listen(port, function(err){
    console.log('Customer360 running on port:', port);;
});


