'use strict';

var expect = require('chai').expect;
var helper = require('../helper');

describe('GET /api/gists/1', function () {
  it('responds with a gist', function (done) {
    helper.withServer(function (request, callback) {
      request.get('/api/gists/1')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          try {
            expect(res.body.id).to.equal('1');
          } catch (e) {
            callback(e, done);
          }

          callback(null, done);
        });
      });
  });
});
