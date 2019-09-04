
var inquirer = require("inquirer")
var mysql = require("mysql")

var stock;

var connection = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",

    // Your port; if not 3306
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "BAMAZON"
});


console.log("Welcome to Bamazon!\n\n====================");
//initial prompts

initialPrompt();

function initialPrompt() {
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
            queryProductID(answers.product_id)
        })
};

/*pseudocode:
inquirer two messages
in then statement
use select * from product where item=id = input and quantity>0
if yes then
do a second connection to update the sql database to reflect remaining quantity
once update goes through show customer total cost of purchase
*/

function queryProductID(input) {
    connection.query("SELECT * FROM PRODUCTS WHERE ITEM_ID=" + input, function (err, res) {
        if (err) throw err;
        stock = res[0].STOCK_QUANTITY
        console.log(res[0])
        console.log(stock)
        if (res[0].STOCK_QUANTITY > 1) {
            console.log("Your search found:\n\nItem ID | Product | Department | Price | Stock Remaining\n")
            console.log(res[0].ITEM_ID + " | " + res[0].PRODUCT_NAME + " | " + res[0].DEPARTMENT_NAME + " | $" + res[0].PRICE + " | " + res[0].STOCK_QUANTITY + " units");
            inquirer.prompt([{
                "type": "confirm",
                "name": "yesNo",
                "message": "Do you wish to proceed with your order?"
            }]).then(yesNo => {
                if (yesNo.yesNo) {
                    //connection.query("UPDATE PRODUCTS SET STOCK_QUANTITY = ")
                }
                else {
                    console.log("OK! Let us know if you change your mind!");
                    connection.end(function (err) {
                        if (err) throw err
                        console.log("Connection ended")
                    })
                }
            })
        }
        else if (res[0].STOCK_QUANTITY === 0) {
            console.log("\nI'm sorry but " + res.PRODUCT_NAME + " is out of stock!")
            connection.end(function (err) {
                if (err) throw err
                console.log("Connection ended")
            })
        }

        console.log("\n-----------------------------------");
    });
}
