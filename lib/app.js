'use strict';

var argv = require('minimist')(process.argv.slice(2));

var express = require('express');
var path = require('path');

var app = express();
var rootDir = path.dirname(require.main.filename);

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
  }

  if (app.get('env') === 'production') {
    app.use(require('errorhandler')());
  }

  /*
   * Router
   */
  require('./router')(app);

  /*
   * Server
   */
  var server = app.listen(parseInt(argv.port) || 3000, function () {
    console.log('Listening on port %d in %s mode',
      server.address().port, app.get('env'));
  });
  return server;
};
