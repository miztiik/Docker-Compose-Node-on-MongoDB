var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

// Set the database name here
var dbName = 'myMoovyDB';
var url = 'mongodb://db1:27017/'+dbName;

// Defines a function insert Document
var insertMooves = function(db, callback) {
	// Get the documents collection
	var collection = db.collection('moovy');
	
	//Create some users
    var mv1 = {'title': 'titanic', 'year': 1997, 'actors': ['Leonardo DiCapri o','Kate Winslet','Billy Zane','Kathy Bates']};
    var mv2 = {'title': 'inception', 'year': 2010, 'actors': ['Leonardo DiCaprio','Joseph Gordon-Levitt','Ellen Page','Tom Hardy']};
    var mv3 = {'title': 'The Wolf of Wall Street', 'year': 2013, 'actors': ['Leonardo DiCaprio','Jonah Hill','Margot Robbie','Matthew McConaughey']};
	
	// Insert some users
    collection.insert([mv1, mv2, mv3], function (err, result) {
      if (err) {
        console.log(err);
      } else {
	    assert.equal(err, null);
        console.log('Inserted %d documents into the "moovy" collection. The documents inserted with "_id" are:\n', result.length, result);
		callback(result);
      }
	});
};

// Find the data document
var findMooves = function (db,callback){
	// Get the documents collection
	var collection = db.collection('moovy');
	
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
	var collection = db.collection('moovy');
	
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
	var collection = db.collection('moovy');
	collection.deleteMany(
      { "title": "inception" },
      function(err, results) {
         console.log("The documents removed were : %s", results);
         callback();
      }
    );
};


// Insert
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } 
  else {
  assert.equal(null, err);
  console.log('Connection established to', url);
  // Call the insert Document function
   insertMooves(db, function() { db.close(); });
  }
});

// Find & Update
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } 
  else {
  assert.equal(null, err);
  console.log('Connection established to', url);
  updateMooves(db, function() { db.close(); });
}
});

// Remove
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } 
  else {
  assert.equal(null, err);
  console.log('Connection established to', url);
  removeMooves(db, function() { db.close(); });
}
});

// Find
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } 
  else {
  assert.equal(null, err);
  console.log('Connection established to', url);
  findMooves(db, function() { db.close(); });
}
});
