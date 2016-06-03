const gulp = require('gulp');
const browserSync = require('browser-sync');
const runSequence = require('run-sequence');

module.exports = (settings) => {
  const watchTasks = [];
  const watchTaskName = 'docs:watch';
  Object.keys(settings.pages).forEach(pageId => {
    const page = settings.pages[pageId];
    const taskName = watchTaskName + ':' + pageId;
    watchTasks.push(taskName);
    gulp.task(taskName, () => {
      return gulp.watch(page.src, () => {
        return runSequence(
          'docs:indexing',
          'docs:render:' + pageId,
          browserSync.reload
        );
      });
    });
  });

  const watchSassTaskName = 'docs:watch:sass';
  watchTasks.push(watchSassTaskName);
  gulp.task(watchSassTaskName, () => {
    return gulp.watch([
      settings.templatePath + '/assets/**/*.scss',
      settings.srcPath + '/**/*.scss'
    ], () => {
      return runSequence(
        'docs:sass',
        browserSync.reload
      );
    });
  });

  gulp.task(watchTaskName, watchTasks);


};
