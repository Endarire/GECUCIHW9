var mysql = require("mysql");
var inquirer = require("inquirer");
var choiceArray = [];
var choiceArrayFullLabel = [];

// create the connection information for the sql database
var connection = mysql.createConnection
({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "whamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err)
{
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// Function starts the action after connection established!
function start()
{
  listItems();
}

function listItems()
{
  // Query the database for all items being sold
  connection.query("SELECT * FROM products", function(err, results)
  {
    if (err) throw err;
  

    // Display all resultant items
    inquirer.prompt
    ([
        {
          name: "choice",
          type: "rawlist",
        
          choices: function()
          {
            
            for (var a = 0; a < results.length; a++)
            {
              //Displays product name, unit price, and remaining quantity if it worked as intended.
              //choiceArrayFullLabel.push(results[a].product_name + " - PRICE EACH: $" + results[a].price + ", QUANTITY REMAINING: " + results[a].stock_quantity);
              
              choiceArray.push(results[a].product_name);
            }
            
            //Returns product name, unit price, and remaining quantity if it worked as intended.
            //return choiceArrayFullLabel;

            //Returns only the item's ID and name.
            return choiceArray;
          },
          message: "Buy somethin'!  Will ya?"
        },
        {
          name: "quantity",
          type: "input",
          message: "How many of this item are you ordering now?\n(Put 0 if you're merely window shoppin' or a\nnegative number if yer donatin' to our business!)"
        }
        
    ])
    .then(function(answer)
    {
        //Tried parsing arrays so the full label (item ID, name, price, and remaining qty) were on the same line.  Worked poorly.
        // for(let d = 0; d < choiceArray.length; d++)
        // {
        //   choiceArrayFullLabel[d] = choiceArray[d];
        // }

        // Get the information of the chosen item
        var chosenItem;

        //This will hold the difference in quantity between the ordered and stocked amounts
        let qtyDif = 0;

        for (var b = 0; b < results.length; b++)
        {
          //.product_name is a database variable
          if (results[b].product_name === answer.choice)
          {
            chosenItem = results[b];
          }
        }

        qtyDif = chosenItem.stock_quantity - answer.quantity;

        console.log("\n-=CHOSEN ITEM STATS=- ")
        console.log("NAME: " + chosenItem.product_name);
        if(chosenItem.product_name === "Cherubim")
        {
          console.log("Cherubim:  Coming soon from a Heaven near you!");4
        }
        console.log("UNIT PRICE: $" + chosenItem.price);
        console.log("ITEM ID: " + chosenItem.item_id + "\n");

        //console.log("qtyDif: ", qtyDif); //displays quantity difference

        // Determine if quantity was high enough
        if(qtyDif >= 0)
        {
          //console.log("ITEM STATS: ", chosenItem); //displays all fields for chosen item
          //console.log("chosenItem: ", chosenItem); //displays all fields for chosen item
          //console.log("answer: ", answer); //displays chosen item's name and quantity ordered

          // Quantity was high enough.  Update database, let the user know, and start over.
          connection.query
          (
            "UPDATE products SET ? WHERE ?",
            [
              {
                //stock_quantity is the MySQL table variable name.
                stock_quantity: qtyDif
              },
              {
                //item_id is the MySQL table variable name.
                item_id: chosenItem.item_id
              }
            ],
            function(error)
            {
              if (error) throw err;

              //Display answer depending on quantity ordered.
              if(answer.quantity == 0) //Double is vital to making this work!  Triple failed!
              {
                console.log("Ya looked at least and now y' know we have " + qtyDif + " more in stock!");
              }

              else if(answer.quantity < 0)
              {
                console.log("Thanks fer donatin' " + -1 * answer.quantity + " more to our stock!");
              }
              else
              {
                console.log("Order successful!  " + qtyDif + " more in stock!");
              }
              start();
            }
          );
        }
        else
        {
          // Too little quantity.
          console.log("You demanded more of that than we have in stock!  Shoo!");
          start();
        }
      });
  });
}