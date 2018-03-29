// Require couchbase and ottoman

var couchbase = require('couchbase');
var ottoman = require('ottoman');

// Create cluster reference, and bucketName and password variables

var bucketName = 'Customer360_odm';
var password = 'password';

var cluster = new couchbase.Cluster('couchbase://127.0.0.1');

// Open Customer360_odm bucket with 'password', and assign as bucket for ottoman



// Define Country Model based on a Country document, assigning countryCode as id, then export



// Define Customer Model, with country attribute defined as a reference to the Country Model, then export




