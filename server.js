/*jshint esversion: 6 */
const express = require('express');
const expHbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('Body-Parser');
const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

const prod = require('./routes/products');
app.use('/products', prod);

const articles = require('./routes/articles');
app.use('/articles', articles);

const hbs = expHbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

const server = app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});