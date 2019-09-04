
var inquirer = require("inquirer")
var mysql = require("mysql")

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
            queryProductID(answers.product_id, answers.product_quantity)
        })
};

function queryProductID(input, quantity) {
    connection.query("SELECT * FROM PRODUCTS WHERE ITEM_ID=" + input, function (err, res) {
        if (err) throw err;
        var stock = res[0].STOCK_QUANTITY;
        var price = res[0].PRICE;
        var totalCost = (price * quantity);
        if (stock > 1) {
            console.log("Your search found:\n\nItem ID | Product | Department | Price | Stock Remaining\n")
            console.log(res[0].ITEM_ID + " | " + res[0].PRODUCT_NAME + " | " + res[0].DEPARTMENT_NAME + " | $" + res[0].PRICE + " | " + stock + " units\n");
            console.log("Your total order cost would be: $" + totalCost + "\n")
            inquirer.prompt([{
                "type": "confirm",
                "name": "yesNo",
                "message": "Do you wish to proceed with your order?"
            }]).then(yesNo => {
                if (yesNo.yesNo) {
                    connection.query("UPDATE PRODUCTS SET STOCK_QUANTITY = " + (stock - quantity) + " WHERE ITEM_ID = " + input, function (err, res) {
                        if (err) throw err;
                        console.log("Your order has been placed!\n\n The total cost is: $" + totalCost + "\n\nThank you for your business!\n");
                    }
                    );
                }
                else {
                    console.log("OK!\n");
                    buyAgain();
                }
            })
        }
        else if (res[0].STOCK_QUANTITY === 0) {
            console.log("\nI'm sorry but we are out of stock of: " + res[0].PRODUCT_NAME);
            buyAgain();
        };

        console.log("\n-----------------------------------");
    });
};

function buyAgain() {
    inquirer.prompt([{
        type: "confirm",
        message: "Is there anything else you would like to buy today?",
        name: "newPurchase"

    }]).then(result => {
        if (result.newPurchase) {
            initialPrompt();
        }
        else {
            console.log("Thank you for your business! Please come back again soon");
            connection.end(function (err) {
                if (err) throw err;
                console.log("Connection ended");
            });
        };
    });
};