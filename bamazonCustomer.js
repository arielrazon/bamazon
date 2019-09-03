
var inquirer = require("inquirer")
var sql = require("sql")



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

    });