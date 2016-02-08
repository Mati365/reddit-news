var gulp = require('gulp')
  , jade = require('gulp-jade')
  , sass = require('gulp-sass')

  , argv = require('yargs').argv

  , browserify = require('browserify')
  , babelify = require('babelify')
  , source = require('vinyl-source-stream');

/** Platform from CLI param */
var buildPlatform = argv.platform || 'chrome';

/** List of all paths */
var paths = {
    scripts: ['extension/platform/' + buildPlatform + '/**/*.js', 'extension/src/**/*.js']
  , views: 'extension/views/**/*.jade'
  , styles: 'extension/sass/**/*.sass'
};

gulp
  /** Compile ES6 scripts to normal */
  .task('build:js', function() {
    return browserify({
        entries: 'extension/src/app.js'
      , extensions: ['.js']
      , debug: true
    })
      .transform(babelify, {presets: ['es2015', 'react']})
      .bundle()
      .pipe(source('app.bundle.js'))
      .pipe(gulp.dest('build/js'));
  })

  /** Build jade views */
  .task('build:jade', function() {
    return gulp.src(paths.views)
      .pipe(jade())
      .pipe(gulp.dest('build/views'));
  })

  /** Build sass files */
  .task('build:sass', function() {
    return gulp.src(paths.styles)
      .pipe(jade())
      .pipe(gulp.dest('build/css'));
  })

  /** Watch all files for changes */
  .task('watch', function() {
    gulp
      .watch(paths.scripts, ['build:js'])
      .watch(paths.views, ['build:jade'])
      .watch(paths.styles, ['build:sass']);
  })

  /** Default task */
  .task('default', ['watch']);
