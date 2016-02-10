var gulp = require('gulp')
  , gulpif = require('gulp-if')
  , uglify = require('gulp-uglify')
  , jade = require('gulp-jade')
  , sass = require('gulp-sass')
  , concat = require('gulp-concat')
  , gutil = require('gulp-util')
  , runSequence = require('run-sequence')

  , del = require('del')
  , argv = require('yargs').argv
  , browserify = require('browserify')
  , babelify = require('babelify')

  , source = require('vinyl-source-stream')
  , buffer = require('vinyl-buffer');

/** Platform from CLI param */
var buildPlatform = argv.platform || 'chrome'
  , production = !!argv.production;

/** List of all paths */
var paths = {
    scripts: ['extension/platform/' + buildPlatform + '/**/*.js', 'extension/src/**/*.js']
  , views: 'extension/views/**/*.jade'
  , styles: 'extension/sass/**/*.sass'
};

gulp
  /** Clean project */
  .task('clean', function() {
    return del(['build']);
  })

  /** Compile ES6 scripts to normal */
  .task('build:js', function() {
    return browserify({
        entries: [
            'extension/src/app.js'
          , 'extension/platform/' + buildPlatform + '/src/listeners.js'
        ]
      , extensions: ['.js']
      , debug: true
    })
      .transform(babelify, {
        presets: ['es2015', 'react']
      })
      .bundle()
      .on("error", gutil.log)
      .pipe(source('app.bundle.js'))
      .pipe(buffer())
      .pipe(gulpif(production, uglify()))
      .pipe(gulp.dest('build/js'));
  })

  /** Build jade views */
  .task('build:jade', function() {
    return gulp
      .src(paths.views)
      .pipe(jade())
      .pipe(gulp.dest('build/views'));
  })

  /** Build sass files */
  .task('build:sass', function() {
    return gulp
      .src(paths.styles)
      .pipe(sass({
        outputStyle: production && 'compressed'
      }))
      .pipe(concat('style.css'))
      .pipe(gulp.dest('build/css'));
  })

  /** Copy files */
  .task('copy:data', function() {
    return gulp
      .src('extension/data/**/*', { base: 'extension/data' })
      .pipe(gulp.dest('build/data/'));
  })

  .task('copy:platform', function() {
    var base = 'extension/platform/' + buildPlatform;
    return gulp
      .src([
          base + '/**/*'
        , '!' + base + '/src'
        , '!' + base + '/src/**/*'
      ], { base: base })
      .pipe(gulp.dest('build/'));
  })

  /** Watch all files for changes */
  .task('watch', function() {
    gulp.watch(paths.scripts, ['build:js']);
    gulp.watch(paths.views, ['build:jade']);
    gulp.watch(paths.styles, ['build:sass']);
  })

  /** Build project */
  .task('build', function(callback) {
    runSequence('clean', ['build:js', 'build:jade', 'build:sass', 'copy:data', 'copy:platform'], callback);
  })

  /** Default task */
  .task('default', ['build', 'watch']);
