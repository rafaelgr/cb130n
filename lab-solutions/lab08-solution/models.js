// Require couchbase and ottoman

// TO DO: replace this hack with npm couchbase when Brett has released the new version
// var couchbase = require('couchbase');
var couchbase = require('../node_modules/ottoman/node_modules/couchbase');
var ottoman = require('ottoman');

// Create cluster reference, and bucketName and password variables

var bucketName = 'Customer360_odm';
var password = 'password';

var cluster = new couchbase.Cluster('couchbase://127.0.0.1');

// Open Customer360_odm bucket with 'password', and assign as bucket for ottoman

ottoman.bucket = cluster.openBucket(bucketName, password);

// Define Country Model based on a Country document, assigning countryCode as id, then export

var Country = ottoman.model('Country', {
	'countryCode': {type: 'string', readonly: true },
	'gdp': 'number',
	'region-number': 'number',
	'name': 'string',
	'updated': 'Date',
	'population': 'number'
}, {
	id: 'countryCode',
	index: {
		findByCountryCode: {
			by: 'countryCode'
		}
	}

});
module.exports.Country = Country;

// Define Customer Model, with country attribute defined as a reference to the Country Model, then export

var Customer = ottoman.model('Customer', {
	'username': {type: 'string', readonly: true },
	'firstName': 'string',
	'lastName': 'string',
	'created': 'Date',
	'billingAddress': {
		// 'country': {ref: Country},
		'country': Country,
		'state': 'string',
		'city': 'string',
		'line1': 'string',
		'postalCode': 'string'
	},
	'updated': 'Date',
	'email': 'string'
}, {
	id: 'username'
});
module.exports.Customer = Customer;



