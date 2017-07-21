/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const ARTICLES_DB = './db/article_db.json';
const fs = require('fs');

router.route('/')
  .get(getArticles)
  .post(trySaveData);

router.route('/:title')
  .get(getArticle)
  .put(editArticle)
  .delete(deleteArticle);

router.get('/new', newArticleForm);
router.get('/:title/edit', editArticleForm);

function trySaveData(req, res) {
  fs.readFile(ARTICLES_DB, (err, data) => {
    if (err) { throw err; }
    let db = JSON.parse(data);

    let exists = db.articles.some( arts => arts.title === req.body.title );
    if (!exists) {
        let title = req.body.title;
        let urlTitle = encodeURI(title);
        let author = req.body.author;
        let body = req.body.body;
        let articleEntry = { title, urlTitle, author, body };
        db.articles.push(articleEntry);
        let dbStr = JSON.stringify(db);
        fs.writeFile(ARTICLES_DB, dbStr, 'utf8', () => {
          if (err) {
            res.redirect('/articles/new');
          }
            res.redirect(`/articles/${title}`);
        });
    } else {
      console.log('article exists');
      res.redirect('/articles/new');
    }
  });
}

function editArticle(req, res) {
  let title;
  if (req.params.title) title = req.params.title;
  if (req.body.title) title = req.body.title;

  let author, body;
  if (req.body.author) author = req.body.author;
  if (req.body.body) body = req.body.body;

  fs.readFile(ARTICLES_DB, (err, data) => {
    if (err) { throw err; }
    let db = JSON.parse(data);
    let article = db.articles.filter( arts => arts.title === title );
    if (article[0]) {
        let index = db.articles.indexOf(article[0]);
        if (!title) name = article[0].title;
        let titleUrl = encodeURI(title);
        if (!author) author = Number(article[0].author);
        if (!body) body = Number(article[0].body);
        let newArticle = { title, titleUrl, author, body };
        db.articles.splice(index, 1, newArticle);
        let dbStr = JSON.stringify(db);
        fs.writeFile(ARTICLES_DB, dbStr, 'utf8', () => {
          if (err) {
            res.redirect(`/articles/${id}/edit`);
          }
            res.redirect(`/articles/${titleUrl}`);
        });
    } else {
      res.redirect(`/articles/${title}/edit`);
    }
  });
}

function deleteArticle(req, res) {
  let title = req.body.title;

  fs.readFile(ARTICLES_DB, (err, data) => {
    if (err) { throw err; }
    let db = JSON.parse(data);
    let article = db.articles.filter( art => art.title === title );
    if (article[0]) {
      let index = db.articles.indexOf(article[0]);
      db.articles.splice(index, 1);
      let dbStr = JSON.stringify(db);
      fs.writeFile(ARTICLES_DB, dbStr, 'utf8', () => {
        if (err) {
          res.redirect(`/articles/${id}/edit`);
        }
          res.redirect(`/articles/`);
        });
    } else {
      res.render('404');
    }
  });
}

function getArticles(req, res){
  fs.readFile(ARTICLES_DB, (err, data) => {
    if (err) { throw err; }
    let db = JSON.parse(data);
    res.render('articleIndex', db);
  });
}

function getArticle(req, res) {
  let title = req.params.title;
  console.log(title);
  fs.readFile(ARTICLES_DB, (err, data) => {
    if (err) { throw err; }
    let db = JSON.parse(data);
    let article = db.articles.filter( art => art.title === title );
    if (article[0]){
      let artObj = { articles : article };
      res.render('articleIndex', artObj);
    } else {
      res.render('404');
    }
  });
}

function editArticleForm(req, res) {
  let title = req.params.title;
  console.log(title);

  fs.readFile(ARTICLES_DB, (err, data) => {
  if (err) { throw err; }
  let db = JSON.parse(data);
  let article = db.articles.filter( art => art.title === title );
  if (article[0]) {
      let title = article[0].title;
      let titleUrl = encodeURI(title);
      let author = article[0].author;
      let body = article[0].body;
      let thisArticle = { title, titleUrl, author, body };
      res.render('editArticle', thisArticle);
    } else {
      res.redirect(`/articles/${title}/edit`);
    }
  });
}

function newArticleForm(req, res){
  res.render('newArticleForm');
}

module.exports = router;