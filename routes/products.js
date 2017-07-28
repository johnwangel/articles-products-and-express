/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
//const PRODUCTS_DB = './db/product_db.json';
//const ARTICLES_DB = './db/article_db.json';
//const fs = require('fs');
const db = require('../db_connect');

let showError = false;

router.get('/', getProducts);
router.get('/new', newForm);
router.get('/:id/edit', editForm);
router.get('/:id', getProduct);

router.post('/', trySaveData);

router.put('/:id', editProduct);

router.delete('/:id', deleteProduct);

function getProducts(req, res){
  db.any('SELECT * FROM products ORDER BY id')
  .then( db => {
    let newObj = { products : db };
    res.render('index', newObj);
  });
}

function trySaveData(req, res) {

  let name = req.body.name;
  let price = req.body.price;
  let inventory = req.body.inventory;

  db.one('INSERT INTO products (id, name, price, inventory) VALUES(DEFAULT, $1, $2, $3) RETURNING id', [name, price, price, inventory])
  .then( data => {
    console.log(data.id);
    res.redirect(`/products/${data.id}`);
  })
  .catch(error => {
      showError = error;
      res.redirect('/products/new');
  });
}

function postError(req, res){
  res.render('404');
}

function newForm(req, res){
  res.render('newForm', {showError: showError});
}

function editForm(req, res) {
  let id = req.params.id;

  db.any('SELECT * FROM products WHERE id = $1', [id])
  .then( result => {
    let newResult = result[0];
    res.render('editForm', newResult);
  })
  .catch(error => {
    showError = "Could not find a record with that ID." + error;
    res.redirect('/products/new');
  });
}

function editProduct(req, res) {
  let id;
  if (req.params.id) id = req.params.id;
  if (req.body.id) id = req.body.id;

  let name, price, inventory;
  if (req.body.name) name = req.body.name;
  if (req.body.price) price = req.body.price;
  if (req.body.inventory) inventory = req.body.inventory;

  db.tx(t => {
    return t.batch([
      t.none('UPDATE products SET name = $2, price = $3, inventory = $4 WHERE id = $1', [id, name, price, inventory])
      ]);
    })
    .then(data => {
      res.redirect(`/products/${id}`);
    })
    .catch(error => {
      showError = 'Cannot find that product.' + error;
      res.redirect(`/products/new`);
    });
}

function getProduct(req, res) {
  let id = req.params.id;

  db.any('SELECT * FROM products WHERE id = $1', [id])
  .then( db => {
    let newObj = { products : db };
    res.render('index', newObj);
  })
  .catch(error => {
    showError = error;
    res.redirect('/products/new');
  });
}

function deleteProduct(req, res) {
  let id = req.params.id;

  db.result('DELETE FROM products WHERE id = $1', [id])
    .then(result => {
      showError = `Record ${id} was successfully deleted.`;
      res.redirect(`/products/`);
    })
    .catch(error => {
        showError = error;
        res.redirect(`/products/${id}/edit`);
    });
}

module.exports = router;