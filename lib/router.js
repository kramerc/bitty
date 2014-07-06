'use strict';

var express = require('express');
var passport = require('passport');
var path = require('path');

var github = require('./github');
var routes = require('./routes');

var rootDir = path.dirname(require.main.filename);

module.exports = function (app) {
  var appDir = path.join(rootDir, 'app');
  var maxAge = 0;
  if (app.get('env') === 'production') {
    appDir = path.join(rootDir, 'build');
    maxAge = 86400000;
  }

  app.get('/auth/github', passport.authenticate('github', {scope: ['gist']}));
  app.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/'
  }));

  app.get('/sessions/info', function (req, res) {
    if (req.user) {
      return github(req).user.get({}, function (err, data) {
        res.send(data);
      });
    }
    res.send(204);
  });
  app.delete('/sessions', function (req, res) {
    req.logOut();
    res.send(204);
  });

  app.post('/api/gists', routes.gists.create);
  app.get('/api/gists/:id', routes.gists.show);
  app.put('/api/gists/:id', routes.gists.update);
  app.get('/api/gists/:gistId/comments', routes.comments.list);
  app.post('/api/gists/:gistId/comments', routes.comments.create);

  app.use(express.static(appDir, {maxAge: maxAge}));

  // Catch-all route for HTML5 URLs
  app.get('*', function (req, res) {
    res.sendfile(path.join(appDir, 'index.html'));
  });
};
