/*jshint esversion: 6 */
const myApp = require('./server.js');
const request = require('supertest')(myApp);
const expect = require('chai').expect;

describe('GET /products', function() {
  it('responds with html', function(done) {
    request
      .get('/products')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });
});

describe('GET /products/3', function() {
  it('responds with html', function(done) {
    request
      .get('/products/3')
      .expect('Content-Type', /text\/html/)
      .expect(200, done);
  });
  it('responds with html', function(done) {
    request
      .get('/products/3')
      .expect(/Etch/)
      .expect(200, done);
  });
  it('responds with html', function(done) {
    request
      .get('/products/3')
      .expect(/Etch/)
      .expect(200, done);
  });
});

describe('GET /products/55', function() {
  it('responds with error', function(done) {
    request
      .get('/products/55')
      .expect(404, done);
  });
});