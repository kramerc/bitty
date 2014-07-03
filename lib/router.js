'use strict';

var express = require('express');
var passport = require('passport');
var path = require('path');

var routes = require('./routes');

var rootDir = path.dirname(require.main.filename);
var appDir = path.join(rootDir, 'app');

module.exports = function (app) {
  app.get('/auth/github', passport.authenticate('github', {scope: ['gist']}));
  app.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/'
  }));

  app.get('/api/gists/:id', routes.gists.show);

  app.use(express.static(appDir));

  // Catch-all route for HTML5 URLs
  app.get('*', function (req, res) {
    res.sendfile(path.join(appDir, 'index.html'));
  });
};
