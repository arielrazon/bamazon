
var inquirer = require("inquirer")
var sql = require("sql")

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 8889,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "BAMAZON"
  });
  

console.log("Welcome to Bamazon!\n\n====================")

inquirer
    .prompt([
        {
            type: "number",
            message: "What is the ID of the product you would like to buy?",
            name: "product_id"
        },
        {
            type: "number",
            message: "How much of this product would you like to buy?",
            name: "product_quantity"
        }
    ])
    .then(answers => {
        connection.connect(function(err) {
            if (err) throw err;
            console.log("connected as id " + connection.threadId);
         
          });
        
    });