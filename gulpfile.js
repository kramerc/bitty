'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var plugins = require('gulp-load-plugins')();

var paths = {
  all: {
    scripts: [
      'app/scripts/**/*.js',
      'lib/**/*.js',
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
  tmp: {
    dir: '.tmp',
    styles: {
      dir: '.tmp/styles',
      glob: './tmp/styles/**/*.css'
    }
  }
};

gulp.task('default', ['build']);

gulp.task('build', ['wiredep', 'fonts', 'html', 'jshint'], function () {
  return gulp.src(paths.app.templates.glob, {base: paths.app.dir})
    .pipe(gulp.dest(paths.build.dir));
});

gulp.task('heroku:production', ['build']);

gulp.task('fonts', function () {
  return plugins.bowerFiles()
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

gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src(paths.app.html)
    .pipe(wiredep())
    .pipe(gulp.dest(paths.app.dir));
});

gulp.task('watch', function () {
  var path = require('path');

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
