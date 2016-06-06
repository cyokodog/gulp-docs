const gulp = require('gulp');
const browserSync = require('browser-sync');
const runSequence = require('run-sequence');

module.exports = (settings) => {

  const watchMd = () => {
    const watchTasks = [];
    const watchTaskName = 'docs:watch:md';
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
    gulp.task(watchTaskName, watchTasks);
    return watchTaskName;
  };


  const watchSass = () => {
    const watchTaskName = 'docs:watch:sass';
    gulp.task(watchTaskName, () => {
      return gulp.watch([
        settings.templatePath + settings.templateAssetsPath + '/**/*.scss',
        settings.srcPath + '/**/*.scss'
      ], () => {
        return runSequence(
          'docs:sass',
          browserSync.reload
        );
      });
    });
    return watchTaskName;
  };

  const watchEs = () => {
    const watchTaskName = 'docs:watch:es';
    gulp.task(watchTaskName, () => {
      return gulp.watch([
        settings.templatePath + settings.templateAssetsPath + '/**/*.js',
        settings.srcPath + '/**/*.js'
      ], () => {
        return runSequence(
          'docs:es',
          browserSync.reload
        );
      });
    });
    return watchTaskName;
  };


  const watchAssets = () => {
    const watchTaskName = 'docs:watch:assets';
    gulp.task(watchTaskName, () => {
      return gulp.watch([
        '!' + settings.templatePath + settings.templateAssetsPath + '/**/*.scss',
        '!' + settings.srcPath + '/**/*.scss',
        '!' + settings.templatePath + settings.templateAssetsPath + '/**/*.js',
        '!' + settings.srcPath + '/**/*.js',
        '!' + settings.templatePath + settings.templateAssetsPath + '/**/*.md',
        '!' + settings.srcPath + '/**/*.md',
        settings.templatePath + settings.templateAssetsPath + '/**/*',
        settings.srcPath + '/**/*'
      ], () => {
        return runSequence(
          'docs:assets',
          browserSync.reload
        );
      });
    });
    return watchTaskName;
  };

  gulp.task('docs:watch', [
    watchMd(),
    watchSass(),
    watchEs(),
    watchAssets()
  ]);

};
