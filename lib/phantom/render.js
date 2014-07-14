/* global phantom */

'use strict';

var system = require('system');
var page = require('webpage').create();
var url = system.args[1];

page.open(url, function () {
  console.log(page.evaluate(function () {
    return document.getElementsByTagName('html')[0].innerHTML;
  }));
  phantom.exit();
});

