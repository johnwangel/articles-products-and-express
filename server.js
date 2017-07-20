/*jshint esversion: 6 */
const express = require('express');
const expHbs = require('express-handlebars');
const fs = require('fs');
const bodyParser = require('Body-Parser');
const PORT = process.env.PORT || 8000;
const PRODUCTS_DB = './db.json';

const app = express();

const hbs = expHbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/products', something);
app.post('/products', trySaveData);

const server = app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

function trySaveData(req, res) {
  fs.readFile(PRODUCTS_DB, (err, data) => {
    if (err) { throw err; }
    let db = JSON.parse(data);

    //check that product does not exist already
    if (!db.products.some( prod => {
        prod.name === req.body.name;
      })) {
        let lastID = db.products[db.products.length-1].id;
        let id = lastID+1;
        let name = req.body.name;
        let price = Number(req.body.price);
        let inventory = Number(req.body.inventory);
        let newProduct = { id, name, price, inventory };
        db.products.push(newProduct);
        let dbStr = JSON.stringify(db);
        console.log(db);
        fs.writeFile(PRODUCTS_DB, dbStr, 'utf8', () => {
          if (err) {
            res.redirect(500, '/products/new')
          };
            res.redirect(200, '/products');
        })
    }
  });
}
