const gulp = require('gulp');
const fs = require('fs-extra');

module.exports = (settings) => {
  gulp.task(
    'docs:clean',
    function (cb) {
      fs.removeSync( settings.docOutputPath );
      fs.removeSync( settings.groupDocOutputPath );
      cb();
    }
  );
};