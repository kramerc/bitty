'use strict';

var request = require('supertest');

exports.withServer = function (callback) {
  var app = require('../../lib/app')();
  request = request(app);

  function stopServer(err, done) {
    app.close();
    done(err);
  }

  callback(request, stopServer);
};
