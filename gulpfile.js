var gulp = require('gulp')
  , plugins = require('gulp-load-plugins')()
  , runSequence = require('run-sequence')

  // Node libs
  , del = require('del')
  , argv = require('yargs').argv

  // Transforms
  , vueify = require('vueify')
  , browserify = require('browserify')
  , babelify = require('babelify')

  , source = require('vinyl-source-stream')
  , buffer = require('vinyl-buffer')

  , _ = require('lodash');

/** Platform from CLI param */
var buildPlatform = argv.platform || 'chrome'
  , production = !!argv.production;

/** List of all paths */
var paths = {
    scripts: [
        'extension/platform/' + buildPlatform + '/**/*'
      , 'extension/src/**/*'
    ]
  , views: 'extension/views/**/*.jade'
  , platform: 'extension/platform/' + buildPlatform
};

/** Clean project */
gulp.task('clean', function() {
  return del(['build']);
});

/** Compile ES6 scripts to normal */
gulp.task('build:js', function() {
  return browserify({
    entries: [
        paths.platform + '/src/actions.js'
      , 'extension/src/app.js'
    ]
    , extensions: ['.js']
    , debug: true
  })
    .transform(vueify)
    .transform(babelify, {
      presets: ['es2015']
    })
    .bundle()

    // Error handling
    .on('error', plugins.util.log)
    .pipe(source('app.bundle.js'))
    .pipe(buffer())
    .pipe(plugins.if(production, plugins.uglify()))
    .pipe(gulp.dest('build/js'));
});

/** Lint warnings */
gulp.task('lint', function () {
  var lint = plugins.eslint;
  return gulp
    .src(_.map(paths.scripts, function(path) {
      return path + '.js';
    }))
    .pipe(lint())
    .pipe(lint.format())
    .pipe(lint.failAfterError());
});

/** Build jade views */
gulp.task('build:jade', function() {
  return gulp
    .src(paths.views)
    .pipe(plugins.jade())
    .pipe(gulp.dest('build/views'));
});

/** Copy files */
gulp
  .task('copy:data', function() {
    return gulp
      .src('extension/data/**/*', { base: 'extension/data' })
      .pipe(gulp.dest('build/data/'));
  })
  .task('copy:platform', function() {
    return gulp
      .src([
          paths.platform + '/**/*'
        , '!' + paths.platform + '/src'
        , '!' + paths.platform + '/src/**/*'
      ], { base: paths.platform })
      .pipe(gulp.dest('build/'));
  });

/** Watch all files for changes */
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['lint', 'build:js']);
  gulp.watch(paths.views, ['build:jade']);
  gulp.watch([
      paths.platform + '/**/*'
    , '!' + paths.platform + '/src/**/*'
  ], ['copy:platform'])
});

/** Build project */
gulp.task('build', function(callback) {
  runSequence('clean', 'lint', ['build:js', 'build:jade', 'copy:data', 'copy:platform'], callback);
});

/** Default task */
gulp.task('default', ['build', 'watch']);
