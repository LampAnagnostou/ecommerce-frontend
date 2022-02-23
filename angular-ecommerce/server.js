//install express server
const express = require('express');
const path = require('path');

const app = express();

//Serve only the static files from the dist directory
app.use(express.static("./dist/angular-ecommerce"));

app.get("/*",(req, res) =>
  res.sendFile('index.html',{root: 'dist/angular-ecommerce/'}));

//start the app by listening to the default Heroku port
app.listen(process.env.PORT || 4200);
