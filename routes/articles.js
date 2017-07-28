/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const ARTICLES_DB = './db/article_db.json';
const fs = require('fs');
const db = require('../db_connect');

router.get('/new', newArticleForm);
router.get('/:id/edit', editArticleForm);

router.route('/')
  .get(getArticles)
  .post(trySaveData);

router.route('/:id')
  .get(getArticle)
  .put(editArticle)
  .delete(deleteArticle);

function getArticles(req, res){
  let myQuery = 'SELECT art.id, art.title, art.body, au.name FROM articles art JOIN authors au ON art.autor_id = au.id ORDER BY art.id';
  db.any(myQuery)
  .then( allArticles => {
    console.log(allArticles);
    let newObj = { articles : allArticles };
    res.render('articleIndex', newObj);
  })
  .catch(err => {
    showError = "That article does not exist exist." + err;
    res.redirect(`/articles/new`);
  });
}

function getArticle(req, res) {
  let artId = req.params.id;
  let myQuery = 'SELECT art.id, art.title, art.body, au.name FROM articles art JOIN authors au ON art.autor_id = au.id WHERE art.id = $1';
  db.any(myQuery, artId)
  .then( thisArticle => {
    console.log(thisArticle);
    let newObj = { articles : thisArticle };
    res.render('articleIndex', newObj);
  })
  .catch(err => {
    showError = "That article does not exist exist." + err;
    res.redirect(`/articles/new`);
  });
}

function newArticleForm(req, res){
  res.render('newArticleForm');
}

function editArticleForm(req, res) {
  let artId = req.params.id;

  let myQuery = 'SELECT art.id, art.title, art.body, au.name FROM articles art JOIN authors au ON art.autor_id = au.id WHERE art.id = $1';
  db.one(myQuery, [artId])
  .then( thisArticle => {
    console.log(thisArticle);
    res.render('editArticle', thisArticle);
  })
  .catch(err => {
    console.log(err);
    showError = "That article does not exist exist." + err;
    res.redirect(`/articles/new`);
  });
}

function editArticle(req, res) {
  let artId;
  if (req.params.id) artId = req.params.id;
  if (req.body.id) artId = req.body.id;

  let title, author, body;
  if (req.body.title) title = req.body.title;
  if (req.body.author) author = req.body.author;
  if (req.body.body) body = req.body.body;

  let myQuery = 'SELECT art.id, art.title, art.body, au.name FROM articles art JOIN authors au ON art.autor_id = au.id WHERE art.id = $1';
  db.any(myQuery, artId)
  .then( thisArticle => {
    console.log(thisArticle);
    let newObj = { articles : thisArticle };
    res.render('editArticle', newObj);
  })
  .catch(err => {
    showError = "That article does not exist exist." + err;
    res.redirect(`/articles/new`);
  });
}

function trySaveData(req, res) {
  console.log(req.body);
  let title = req.body.title;
  let urlTitle = encodeURI(title);
  let author = req.body.author;
  let body = req.body.body;
  let auId;

  db.query('INSERT INTO authors (id, name) VALUES(DEFAULT, $1) RETURNING id', [author])
  .then(data => {
    auId = data[0].id;
    console.log(auId);

    db.query('INSERT INTO articles (id, title, title_url, autor_id, body) VALUES(DEFAULT, $1, $2, $3, $4) RETURNING id', [title, urlTitle, auId, body])
    .then( data => {
      console.log(data[0].id);
      res.redirect(`/articles/${data[0].id}`);
    });
  })
  .catch(error => {
    console.log(error);
  });
}


function deleteArticle(req, res) {
  let id = req.body.id;

  db.result('DELETE FROM articles WHERE id = $1', [id])
    .then(result => {
      showError = `Record ${id} was successfully deleted.`;
      res.redirect(`/articles/`);
    })
    .catch(error => {
        showError = error;
        res.redirect(`/articles/${id}/edit`);
    });
}

module.exports = router;