/* jshint maxlen:false */

'use strict';

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '..',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/marked/lib/marked.js',
      'app/bower_components/angular-marked/angular-marked.js',
      'app/bower_components/angular-moment/angular-moment.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/ace-builds/src-noconflict/ace.js',
      'app/bower_components/angular-ui-ace/ui-ace.js',
      'app/bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/bower_components/highlightjs/highlight.pack.js',
      'app/scripts/**/*.js',
      'node_modules/chai/chai.js',
      'test/client/**/*.js'
    ],

    // list of files to exclude
    exclude: [
      'test/**/helper.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'PhantomJS'
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
