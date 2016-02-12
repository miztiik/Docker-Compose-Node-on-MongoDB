'use strict';

const express = require('express');
// Constants
const PORT = 8081;

var os = require("os");
var hostname = os.hostname();

// App
const app = express();
app.get('/', function (req, res) {
  res.send('<html><body>Hello from Node.js container ' + hostname + '</body></html>');
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);