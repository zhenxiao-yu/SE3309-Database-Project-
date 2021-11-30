//get express package
const express = require("express");
//create express app instance
const app = express();
//using mysql
const mysql = require("mysql");

//setup db connection
const db = mysql.createConnection({
  //your db credentials
  user:'root',
  host:'34.66.235.245',
  password:'admin',
  database:'SE3309'
});

//connect
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL connection established");
});

const port = 3001; //port number
const server = `http://localhost:${port}`;
app.listen(port, () => console.log(`Server started. Running at: ${server}`));

//define apis below

app.get("/products", function (req, res) {
    //return list of all products
});
