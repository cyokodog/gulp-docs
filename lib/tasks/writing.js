const gulp = require('gulp');
const runSequence = require('run-sequence');

module.exports = () => {
  gulp.task(
    'docs:writing',
    function (cb) {
      runSequence('docs:clean', 'docs:build', 'docs:serve', 'docs:watch', cb);
    }
  );
};
