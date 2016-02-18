'use strict';

const express = require('express');
var fs = require('fs');
var os = require("os");

// set our port
// var port = process.env.PORT || 8081;
const PORT = 8081;

var hostname = os.hostname();

// Setup the mongo client
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

// Set the database name here
var dbName = 'myMoovyDB-';
// var mongodbURL = 'mongodb://db1:27017/'+dbName;
var mongodbURL = 'mongodb://testadmin:testadmin@ds059375.mongolab.com:59375/moovydb-test';
var mongodbCollections ='moovy';

// App
const app = express();
var bodyParser = require('body-parser');
// instruct the app to use the `bodyParser()` middleware for all routes
// to support JSON-encoded bodies
app.use( bodyParser.json() );
// to support URL-encoded bodies
app.use( bodyParser.urlencoded({ extended: true }) );



app.get('/', function(req, res){
    var html = fs.readFileSync('index.html') + 
	           '<br /><br /><div><span style="color: #33cc33;border-bottom: 1px solid #f2f2f2;font-size: 10pt">Node.js server is available & running on <i>' + hostname  + '</i><br /></span></div>';
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
});

app.post('/',function(req,res){
  var mTitle = req.body.mediaTitle;
  var mYear = req.body.mediaYear;  
  var request = require('request');
  //http://www.omdbapi.com/?t=titanic&y=1997&plot=short&r=json
  var options = {
				url: 'http://www.omdbapi.com/?&plot=short&r=json&t='+mTitle+'&y='+mYear,
				headers:{
						'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
						'Referer': 'https://www.google.co.in'
						}
				};		
				
function callback(error, response, body) {
	if (!error && response.statusCode == 200) {
	
	try {
		var mArray = JSON.parse(body);
	} 
	catch (err) {
        console.error('Unable to parse response as JSON', err);
        //return cb(err);
    }

	// Insert into Mongo only when we find metadata
	if (mArray.hasOwnProperty('Year') && mArray.hasOwnProperty('Title')) {
		MongoClient.connect(mongodbURL, function (err, db) {
			if (err) {
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} 
			else {
				assert.equal(null, err);
				console.log('Connection established to', mongodbURL);
				// Call the insert Document function
				insertMooves(db,mArray, function() { db.close(); });
			}
		});
	}

		
	// Prepart the content to show on webpage
	var prepContent="";
	var mContent="<html><head><style>#rcorners {border-radius: 25px;border: 2px solid #ccccff;padding: 20px;} tr:nth-child(even) {background-color: #efeff5;}</style></head><body>";
	mContent = mContent + "<br /><br /><h3>Your media of choice is <b><i>"+mTitle+"</b></i>, Year of release is '"+mYear+"', Thats a good one!</h3>"
	for (var key in mArray) {
		if (key != "Poster"){
			prepContent = prepContent + "<tr><td>"+key+":</td><td>"+mArray[key]+"</td></tr>";
		}
		else {
			prepContent = prepContent + "<tr><td>"+key+":</td><td><a href='"+mArray[key]+"'><img src='"+mArray[key]+"'alt='Movie Poster'></a></td></tr>";
		}
	}
       // console.log(body)
       var mContent = fs.readFileSync('index.html') + mContent + "<table id='rcorners'>"+ prepContent +"</table></body>" +
	               "<br /><br /><div><span style='color: #33cc33;border-bottom: 1px solid #f2f2f2;font-size: 10pt'>Node.js server is available & running on <i>" + hostname  + "</i><br /></span></div>" +
				   "</html>";
       res.send(mContent);
	}
	else {
        res.send(error);
	}
}
	request(options, callback);
});

// Defines a function insert Document
var insertMooves = function(db, mArray, callback) {
	// Get the documents collection
	var collection = db.collection(mongodbCollections);
		
	// Insert some users
    collection.insert([mArray], function (err, result) {
      if (err) {
        console.log(err);
      } else {
	    assert.equal(err, null);
        //console.log('Inserted %d documents into the ' + mongodbCollections + ' collection. The documents inserted with "_id" are:\n', result.length, result);
		callback(result);
      }
	});
};

// Find the data document
var findMooves = function (db,callback){
	// Get the documents collection
	var collection = db.collection(mongodbCollections);
	
	var cursor = collection.find({ $or: [ { 'title' : 'Titanic' }, { "title" : "titanic" } ]});
	cursor.each(function(err, doc) {
      if (doc != null) {
         console.log("The following docs were found,");
		 console.dir(doc);
      } 
	  else {
	    console.log("No documents were found");
		callback();
      }
	});
};

// Udpate the data document
var updateMooves = function(db, callback) {
	// Get the documents collection
	var collection = db.collection(mongodbCollections);
	
   collection.update(
   { 'title' : 'titanic' },
      {
        $set: { 'title': 'Titanic' },
		$set: { actors: ['Leonardo DiCaprio','Kate Winslet','Billy Zane','Kathy Bates']},
        $currentDate: { "lastModified": true }
      },
	  {
		multi: true
	  },
	  function(err, results) {
      console.log("The documents were edited : %s", results);
      callback();
   });
};

// Remove the specified document
var removeMooves = function(db, callback) {
	// Get the documents collection
	var collection = db.collection(mongodbCollections);
	collection.deleteMany(
      { "title": "inception" },
      function(err, results) {
         console.log("The documents removed were : %s", results);
         callback();
      }
    );
};


// Find & Update
MongoClient.connect(mongodbURL, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } 
  else {
  assert.equal(null, err);
  //updateMooves(db, function() { db.close(); });
}
});

// Remove
MongoClient.connect(mongodbURL, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } 
  else {
  assert.equal(null, err);
  //removeMooves(db, function() { db.close(); });
}
});

// Find
MongoClient.connect(mongodbURL, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } 
  else {
  assert.equal(null, err);
  //findMooves(db, function() { db.close(); });
}
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
