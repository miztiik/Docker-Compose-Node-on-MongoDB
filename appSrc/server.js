'use strict';

const express = require('express');
// Constants
const PORT = 8089;

var os = require("os");
var hostname = os.hostname();

// App
const app = express();
var bodyParser = require('body-parser');
// instruct the app to use the `bodyParser()` middleware for all routes
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/', function(req, res){
  // The form's action is '/' and its method is 'POST',
  // so the `app.post('/', ...` route will receive the
  // result of our form
  var html = '<form action="/" method="post">' +
               'Media Title:' +
               '<input type="text" name="mediaTitle" placeholder="..." />' +
               '<br>' +
               'Year:' +
               '<input type="text" name="mediaYear" placeholder="..." />' +
               '<button type="submit">Submit</button>' +
             '</form>' +
             '<br />Node.js container running on' + hostname  + '<br />';
               
  res.send(html);
});


app.post('/',function(req,res){
  var mTitle = req.body.mediaTitle;
  var mYear = req.body.mediaYear;  
  var request = require('request');
  //http://www.omdbapi.com/?t=titanic&y=1997&plot=short&r=json
  
  var options = {
				url: 'http://www.omdbapi.com/?&plot=short&r=json&t='+mTitle+'&y='+mYear,
				headers:{
						'User-Agent': 'request'
						}
				};
  
function callback(error, response, body) {
	if (!error && response.statusCode == 200) {
		var mArray = JSON.parse(body);
		var prepContent="";
		for (var key in mArray) {
			if (key != "Poster"){
				prepContent = prepContent +"<tr><td>"+key+":</td><td>"+mArray[key]+"</td></tr>";
			}
			else {
				prepContent = prepContent +"<tr><td>"+key+":</td><td><img src='"+mArray[key]+"' alt='Movie Poster'></td></tr>";
			}
			// console.log(body)
			var mContent = "<table>"+ prepContent +"</table>";
			var html = mContent + "<br /><br />The Media of choice is <b><i>"+mTitle+"</b></i>, Year of release is "+mYear+", Thats a good one!";
			res.send(html);
		}
	}
	else {
	  res.send(error);
	}
}
  
request(options, callback);
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
