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
  var html ="<html><head><style>" +
            "#rcorners {border-radius: 25px;border: 2px solid #ccccff;padding: 20px;}" +
            "#rbutton {background-color: #008CBA;border: 1px;border-radius: 8px;color: white;padding: 12px 12px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;}" + 
            "#rtextbox {width: 300px; height: 40px; padding: 1px;font-size: 20pt}" +			
			"</style></head><body>";
  html = html + '<br>' +
                '<br>' +
			  	'<form id="rcorners" action="/" method="post">' +
                '<b style="font-size: 18pt">Media Title:</b>' +
                '<input id="rtextbox" type="text" name="mediaTitle" placeholder="..." />' +
                '&nbsp;&nbsp;' +
				'<b style="font-size: 18pt">Year:</b>' +
                '<input id="rtextbox" type="text" name="mediaYear" maxlength="4" placeholder="..." />' +
			    '&nbsp;&nbsp;' +
                '<button id="rbutton" type="submit">Search for media</button>' +
                '</form>' +
                '<br /><br />Node server is hosted on <i>' + hostname  + '</i><br /></body></head></html>';
               
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
        var mContent = mContent + "<table id='rcorners'>"+ prepContent +"</table></body></head></html>";
        res.send(mContent);
	}
	else {
        res.send(error);
	}
}
request(options, callback);
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
