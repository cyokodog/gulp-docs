const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const fs = require('fs-extra');
const path = require('path');
const runSequence = require('run-sequence');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

module.exports = (settings) => {

  gulp.task('docs:es:convert', () => {
    return gulp.src([
      settings.templatePath + settings.templateAssetsPath + '/**/*.js',
      settings.srcPath + '/**/*.js'
    ])
    .pipe($.cached())
    .pipe($.using())
    .pipe($.babel())
    .pipe(gulp.dest(settings.docOutputPath));
  });

  gulp.task('docs:es:bundle', cb => {
    const entryPath = settings.docOutputPath + settings.bundleEntryPath;
    if( !fs.existsSync(entryPath) ){
       cb();
       return;
    }
    const bundleFileName = path.basename(entryPath, '.js') + '.min.js';
    return browserify(entryPath)
      .bundle()
      .pipe(source(bundleFileName))
      .pipe(buffer())
      .pipe($.uglify())
      .pipe(gulp.dest(path.dirname(entryPath)));
  });

  gulp.task('docs:es', cb => {
    runSequence(
      'docs:es:convert',
      'docs:es:bundle',
      cb
    );
  });

};
