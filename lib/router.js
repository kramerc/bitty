'use strict';

var express = require('express');
var passport = require('passport');
var path = require('path');

var rootDir = path.dirname(require.main.filename);

module.exports = function (app) {
  app.get('/auth/github', passport.authenticate('github', {scope: ['gist']}));
  app.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/'
  }));

  app.use(express.static(path.join(rootDir, 'app')));
};
