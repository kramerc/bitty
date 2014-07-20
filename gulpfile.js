'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var plugins = require('gulp-load-plugins')();

var path = require('path');

var paths = {
  all: {
    scripts: [
      'app/scripts/**/*.js',
      'lib/**/*.js',
      'test/**/*.js',
      'gulpfile.js',
      'index.js'
    ]
  },
  app: {
    dir: 'app',
    glob: ['app/**/*', '!app/bower_components/**/*'],
    bower: {
      dir: 'app/bower_components'
    },
    html: 'app/index.html',
    scripts: {
      dir: 'app/scripts',
      entry: 'app/scripts/app.js'
    },
    styles: {
      dir: 'app/styles',
      entry: 'app/styles/app.scss'
    },
    templates: {
      glob: 'app/templates/**/*.html'
    }
  },
  bower: {
    json: 'bower.json'
  },
  build: {
    dir: 'build',
    assets: {
      dir: 'build/assets'
    }
  },
  test: {
    config: 'test/karma.conf.js',
    server: {
      glob: ['test/server/**/*.js', '!test/**/helper.js']
    }
  },
  tmp: {
    dir: '.tmp',
    styles: {
      dir: '.tmp/styles',
      glob: './tmp/styles/**/*.css'
    }
  }
};

function runKarma(options, callback) {
  var _ = require('lodash');
  var karma = require('karma').server;
  var karmaParseConfig = require('karma/lib/config').parseConfig;

  var config = karmaParseConfig(path.resolve(paths.test.config), {});

  if (!callback) {
    callback = options;
    options = {};
  }

  karma.start(_.assign({}, config, options), function (exitCode) {
    gutil.log('Karma has exited with ' + gutil.colors.red(exitCode));
    callback();
    if (exitCode > 0) {
      process.exit(exitCode);
    }
  });
}

gulp.task('default', ['build']);

gulp.task('build', ['wiredep', 'fonts', 'html', 'jshint'], function () {
  return gulp.src(paths.app.templates.glob, {base: paths.app.dir})
    .pipe(gulp.dest(paths.build.dir));
});

gulp.task('test', ['test:client', 'test:server']);

gulp.task('heroku:production', ['build']);

gulp.task('fonts', function () {
  plugins.bowerFiles()
    .pipe(plugins.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe(plugins.flatten())
    .pipe(gulp.dest(paths.build.assets.dir));
});

gulp.task('html', ['styles'], function () {
  var searchPath = '{' + paths.tmp.dir + ',' + paths.app.dir + '}';

  return gulp.src(paths.app.html)
    .pipe(plugins.useref.assets({searchPath: searchPath})
      .on('error', gutil.log))
    .pipe(plugins.useref.restore())
    .pipe(plugins.if('*.js', plugins.ngmin()))
    .pipe(plugins.if('*.js', plugins.uglify({preserveComments: 'some'})))
    .pipe(plugins.if('*.css', plugins.csso()))
    .pipe(plugins.useref())
    .pipe(gulp.dest(paths.build.dir));
});

gulp.task('jshint', function () {
  return gulp.src(paths.all.scripts)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('styles', function () {
  return gulp.src(paths.app.styles.entry)
    .pipe(plugins.sass({includePaths: [paths.app.bower.dir]}))
    .pipe(gulp.dest(paths.tmp.styles.dir));
});

gulp.task('test:client', function (callback) {
  runKarma({singleRun: true}, callback);
});

gulp.task('test:server', function () {
  gulp.src(paths.test.server.glob)
    .pipe(plugins.mocha());
});

gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src(paths.app.html)
    .pipe(wiredep())
    .pipe(gulp.dest(paths.app.dir));
});

gulp.task('watch', ['watch:test', 'watch:serve']);

gulp.task('watch:serve', function () {
  // Start and watch the Express server
  plugins.nodemon({
    script: 'index.js',
    ext: 'js',
    ignore: [
      paths.app.dir + '/'
    ]
  });

  // Start the LiveReload server
  plugins.livereload.listen();

  // Watch for changes
  gulp.watch(paths.app.glob, function (event) {
    // Build a path that is relative to the browser
    var relativePath = '/' + path.relative(__dirname, event.path);
    relativePath = relativePath.replace(paths.app.dir + '/', '');
    relativePath = relativePath.replace('.scss', '.css');
    plugins.livereload.changed(relativePath);
  });
  gulp.watch(paths.app.styles.glob, ['styles']);
  gulp.watch(paths.bower.json, ['wiredep']);
});

gulp.task('watch:test', function () {
  var backend = paths.all.scripts;
  backend.shift();

  runKarma(function () {
    process.exit(0);
  });
  gulp.watch(backend, function () {
    gulp.src(paths.test.server.glob)
      .pipe(plugins.mocha())
      .on('error', function (err) {
        console.error(err.message);
      });
  });
});
