const gulp = require('gulp');
const browserSync = require('browser-sync');

module.exports = (settings) => {
  gulp.task(
    'docs:serve', () => {
      browserSync({
        server: {
          baseDir: settings.docOutputPath
        }
      });
    }
  );
};