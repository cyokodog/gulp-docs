const gulp = require('gulp');
const runSequence = require('run-sequence');

module.exports = () => {
  gulp.task('docs:build', cb => {
    runSequence(
      'docs:clean',
      'docs:indexing',
      'docs:render',
      'docs:sass',
      cb
    );
  });
};
