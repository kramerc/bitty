'use strict';

var express = require('express');
var passport = require('passport');
var path = require('path');
var session = require('express-session');

var MemoryStore = session.MemoryStore;
var RedisStore = require('connect-redis')(session);

var app = express();
var rootDir = path.dirname(require.main.filename);
var sessionStore;

module.exports = function () {
  /*
   * App
   */
  app.use(require('cookie-parser')());
  app.use(require('body-parser').json());
  app.use(require('method-override')());

  if (app.get('env') === 'development') {
    app.use(require('connect-livereload')());
    app.use(require('morgan')('dev'));
    app.use(require('errorhandler')({dumpExceptions: true, showStack: true}));

    app.use(require('node-sass-middleware')({
      src: path.join(rootDir, '/app/styles'),
      prefix: '/styles',
      response: true,
      includePaths: [path.join(rootDir, '/app/bower_components')]
    }));

    sessionStore = new MemoryStore();
  }

  if (app.get('env') === 'production') {
    app.use(require('errorhandler')());
    sessionStore = new RedisStore({
      url: process.env.REDISCLOUD_URL
    });
  }

  /*
   * Session
   */
  var secret = process.env.SECRET;
  if (!process.env.SECRET) {
    console.warn('SECRET environment variable is not set');
    secret = 'sonotsecret';
  }
  app.use(require('express-session')({
    secret: secret,
    store: sessionStore
  }));

  /*
   * Passport
   */
  app.use(passport.initialize());
  app.use(passport.session());
  require('./passport')();

  /*
   * Router
   */
  require('./router')(app);

  /*
   * Server
   */
  var server = app.listen(parseInt(process.env.PORT) || 3000, function () {
    console.log('Listening on port %d in %s mode',
      server.address().port, app.get('env'));
  });
  return server;
};
