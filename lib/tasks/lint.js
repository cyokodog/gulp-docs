const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

module.exports = () => {
  gulp.task('docs:lint', () => {
    return gulp.src(['./lib/**/*.js'])
      .pipe($.eslint())
      .pipe($.eslint.format())
      .pipe($.eslint.failOnError());
  });
};
