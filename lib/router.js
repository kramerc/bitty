/* jshint camelcase:false */

'use strict';

var childProcess = require('child_process');
var express = require('express');
var passport = require('passport');
var path = require('path');
var phantomjs = require('phantomjs');

var github = require('./github');
var routes = require('./routes');

var rootDir = path.dirname(require.main.filename);

function renderPage(appDir, maxAge) {
  return function (req, res) {
    if (req.query._escaped_fragment_ !== undefined) {
      var script = './lib/phantom/render.js';
      var url = 'http://' + req.headers.host + req.url.replace(
        '_escaped_fragment_=' + req.query._escaped_fragment_, '');
      var childArgs = [script, url];
      childProcess.execFile(phantomjs.path, childArgs, function (err, stdout) {
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8'
        });
        res.end('<!DOCTYPE html><html>' + stdout + '</html>');
      });
    } else {
      res.sendfile(path.join(appDir, 'index.html'), {maxAge: maxAge});
    }
  };
}

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
  app.put('/api/gists/:gistId/comments/:id', routes.comments.update);
  app.delete('/api/gists/:gistId/comments/:id', routes.comments.delete);

  app.get('/', renderPage(appDir, maxAge));
  app.get('/index.html', renderPage(appDir, maxAge));
  app.use(express.static(appDir, {maxAge: maxAge}));
  app.get('*', renderPage(appDir, maxAge));
};
