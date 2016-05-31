const gulp = require('gulp');
const runSequence = require('run-sequence');

module.exports = (settings) => {
  gulp.task(
    'docs:develop',
    function (cb) {
      runSequence('docs:clean', 'docs:build', 'docs:serve', 'docs:watch', cb);
    }
  );
};
