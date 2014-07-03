'use strict';

var express = require('express');
var path = require('path');

var rootDir = path.dirname(require.main.filename);

module.exports = function (app) {
  app.use(express.static(path.join(rootDir, 'app')));
};
