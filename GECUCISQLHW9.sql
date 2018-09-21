DROP DATABASE IF EXISTS whamazon;
CREATE DATABASE whamazon;
USE whamazon;

/* Create new table with a primary key that auto-increments and other relevant columns.*/
CREATE TABLE IF NOT EXISTS products
(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Honey", "I'm Home", 5.29, 9947),
       ("Simpsons Balloons", "Toys & Novelties", 20.99, 2),
       ("Life, the Universe, and Everything", "Metaphysics", 999999, 1),
       ("Cherubim", "Imaginatorium Studios", 19.99, 316),
       ("Fish", "I Didn't Have Any Threes", 1, 44),
       ("Stretch Armstrong", "Toys & Novelties", 20.99, 40), 
       ("Light", "Brilliance", 0.01, -1),
       ("Strawberry Ice Cream", "Simpsons References", 4.59, 500);

SELECT * FROM products;