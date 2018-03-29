// Install couchbase module, then require it here

var couchbase = require("couchbase");

// Connect to Couchbase server URL

var cluster = new couchbase.Cluster("127.0.0.1:8091");

// Open data bucket on server

var bucket = cluster.openBucket("Customer360", "password", function(err) {
    if(err) throw err;

    // Get known document by document-id, assign rowsing value to local var, and log name and population values

    bucket.get("country::US", function(err, rows) {
        if(err) throw err;

        // Display the rows (JSON Document) to the console

        console.log("JSON Document \n", rows);

        // Display the value of the rows (JSON Object) to the console

        console.log("JSON Object \n", rows.value);

        // Display specific values to the console        

        var JsonObj = rows.value;
        console.log("name - " + JsonObj.name + "\npopulation - " + JsonObj.population);

        // Disconnect from the bucket

        bucket.disconnect();

        // Configure admin password on bucket, use password to open bucket

    });
    
});