
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
        connection.connect(function (err) {
            if (err) throw err;
            console.log("connected as id " + connection.threadId);
            queryProductID(answers.product_id)
        });

    });

function queryProductID(input) {
    connection.query("SELECT * FROM PRODUCTS WHERE ITEM_ID=" + input, function (err, res) {
        if (err) throw err;
        if (res.STOCK_QUANTITY > 1) {
            console.log("Your search found:\n\nItem ID | Product | Department | Price | Stock Remaining\n")
            console.log(res.ITEM_ID + " | " + res.PRODUCT_NAME + " | " + res.DEPARTMENT_NAME + " | $" + res.PRICE + " | " + res.STOCK_QUANTITY + " units");
            inquirer.prompt([{

            }]).then(yesNo)
        }


        else if (res.STOCK_QUANTITY === 0) {
            console.log("\nI'm sorry but " + res.PRODUCT_NAME + " is out of stock!")
        }

        console.log("\n-----------------------------------");
    });
}
