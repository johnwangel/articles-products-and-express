/*jshint esversion: 6 */
const pgp = require('pg-promise')();

const cn = {
    host: 'localhost',
    port: 5432,
    database: 'products_articles'
};
const db = pgp(cn);

module.exports = db;