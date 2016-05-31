const gulp = require('gulp');
const runSequence = require('run-sequence');

module.exports = (settings) => {
  gulp.task('docs:build', cb => {
    runSequence('docs:clean','docs:indexing', 'docs:render', cb);
  });
};