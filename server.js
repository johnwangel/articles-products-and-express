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

app.get('/products', getProducts);
app.get('/products/new', postError);
app.get('/products/:id', getProduct);
app.get('/products/:id/edit', postError);

app.post('/products', trySaveData);

app.put('/products/:id', editProduct);

app.delete('/products/:id', deleteProduct);

const server = app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

function trySaveData(req, res) {
  fs.readFile(PRODUCTS_DB, (err, data) => {
    if (err) { throw err; }
    let db = JSON.parse(data);

    let exists = db.products.some( prod => prod.name === req.body.name );
    if (!exists) {
        let lastID = db.products[db.products.length-1].id;
        let id = lastID+1;
        let name = req.body.name;
        let price = Number(req.body.price);
        let inventory = Number(req.body.inventory);
        let newProduct = { id, name, price, inventory };
        db.products.push(newProduct);
        let dbStr = JSON.stringify(db);
        fs.writeFile(PRODUCTS_DB, dbStr, 'utf8', () => {
          if (err) {
            res.redirect(500, '/products/new');
          }
            res.redirect(200, `/products/${id}`);
        });
    } else {
      console.log('product exists');
      res.redirect(500, '/products/new');
    }
  });
}

function getProducts(req, res){
  fs.readFile(PRODUCTS_DB, (err, data) => {
    if (err) { throw err; }
    let db = JSON.parse(data);
    res.render('index', db);
  });
}

function postError(req, res){
  res.render('404');
}

function editProduct(req, res) {
  let id = req.params.id;
  let name, price, inventory;
  if (req.body.name) name = req.body.name;
  if (req.body.price) price = req.body.price;
  if (req.body.inventory) inventory = req.body.inventory;

  fs.readFile(PRODUCTS_DB, (err, data) => {
    if (err) { throw err; }
    let db = JSON.parse(data);
    let product = db.products.filter( prod => Number(prod.id) === Number(id) );
    if (product[0]) {
        let index = db.products.indexOf(product[0]);
        if (!name) name = product[0].name;
        if (!price) price = Number(product[0].price);
        if (!inventory) inventory = Number(product[0].inventory);
        let newProduct = { id, name, price, inventory };
        db.products.splice(index, 1, newProduct);
        let dbStr = JSON.stringify(db);
        fs.writeFile(PRODUCTS_DB, dbStr, 'utf8', () => {
          if (err) {
            res.redirect(500, `/products/${id}/edit`);
          }
            res.redirect(200, `/products/${id}`);
        });
    } else {
      res.redirect(500, `/products/${id}/edit`);
    }
  });
}

function getProduct(req, res) {
  let id = req.params.id;
  fs.readFile(PRODUCTS_DB, (err, data) => {
    if (err) { throw err; }
    let db = JSON.parse(data);
    let products = db.products.filter( prod => Number(prod.id) === Number(id) );
    if (products[0]){
      let prodObj = { products };
      res.render('index', prodObj);
    } else {
      res.render('404');
    }
  });
}

function deleteProduct(req, res) {
  let id = req.params.id;

  fs.readFile(PRODUCTS_DB, (err, data) => {
    if (err) { throw err; }
    let db = JSON.parse(data);
    let product = db.products.filter( prod => Number(prod.id) === Number(id) );
    if (product[0]) {
      let index = db.products.indexOf(product[0]);
      db.products.splice(index, 1);
      let dbStr = JSON.stringify(db);
      fs.writeFile(PRODUCTS_DB, dbStr, 'utf8', () => {
        if (err) {
          res.redirect(500, `/products/${id}/edit`);
        }
          res.redirect(200, `/products/`);
        });
    } else {
      res.render('404');
    }
  });
}