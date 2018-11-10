var mysql = require("mysql");
var inquirer = require("inquirer");
var choiceArray = [];

//Create the connection information for the SQL database.
var connection = mysql.createConnection
({
  host: "localhost",

  //Your port (default 3306).
  port: 3306,

  //Your username.
  user: "root",

  //Your password.
  password: "root",
  database: "whamazon"
});

//Connect to the MySQL server and SQL database.
connection.connect(function(err)
{
  if (err) throw err;
  //Connect to the database then run start().
  start();
});

//Function starts the action after connection is established!
function start()
{
  listItems();
}

function listItems()
{
  //Query the database for all items for sale.
  connection.query("SELECT * FROM products", function(err, results)
  {
    if (err) throw err;
  
    //Display all resultant items.
    inquirer.prompt
    ([
        {
          name: "choice",
          type: "rawlist",
        
          choices: function()
          {
            
            for (var a = 0; a < results.length; a++)
            {              
              choiceArray.push(results[a].product_name);
            }

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
        //Get the information of the chosen item
        var chosenItem;

        //This will hold the difference in quantity between the ordered and stocked amounts
        let qtyDif = 0;

        for (var b = 0; b < results.length; b++)
        {
          //.product_name is a database variable.
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

        //Determine if quantity was high enough
        if(qtyDif >= 0)
        {
          //Quantity was high enough.  Update database, let the user know, and start over.
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
          //Too little quantity.
          console.log("You demanded more of that than we have in stock!  Shoo!");
          start();
        }
      });
  });
}