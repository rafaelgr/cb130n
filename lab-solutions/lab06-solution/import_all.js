'use strict';

var fs = require('fs');
var async = require('async');
var ottoman = require('ottoman');
var models = require('./models');

fs.readdir('docs/', function (err, files) {
  if (err) throw err;

  console.log('Loading documents...');

  // Filter out only the .JSON files
  files = files.filter(function(file) {
    if (file.substr(file.length-4) != 'json') {
      return false;
    }
    return true;
  });

  // Read all the document files
  async.map(files, function(file, callback) {
    fs.readFile('docs/' + file, function(err, buffer) {
      if (err) return callback(err);
      callback(null, JSON.parse(buffer));
    });
  }, function(err, docs) {
    if (err) throw err;

    console.log('Loaded all documents to memory');

    var countryDatas = [];
    var customerDatas = [];
    for (var i = 0; i < docs.length; ++i) {
      if (docs[i].type == 'country') {
        countryDatas.push(docs[i]);
      } else if (docs[i].type == 'customer') {
        customerDatas.push(docs[i]);
      }
    }

    console.log('Storing countries...');

    // Insert all the countries
    async.map(countryDatas, function(countryData, callback) {
      // Drop the original modelling fields
      delete countryData.type;
      delete countryData.id;

      // Create the country
      models.Country.create(countryData, callback);
    }, function(err, countries) {
      if (err) throw err;

      console.log('All countries stored');

      var countryMap = {};
      for (var i = 0; i < countries.length; ++i) {
        countryMap[countries[i].countryCode] = countries[i];
      }

      console.log('Storing customers...');

      // Insert all the Customers
      async.map(customerDatas, function(customerData, callback) {
        // Drop the original modelling fields
        delete customerData.type;
        delete customerData.id;

        // Map the customers country code to an actual country object
        customerData.billingAddress.country = countryMap[
            customerData.billingAddress.country];

        // Create the customer
        models.Customer.create(customerData, callback);
      }, function(err, customers) {
        if (err) throw err;

        console.log('All customers stored');
        process.exit(0);
      })
    });
  });
});
