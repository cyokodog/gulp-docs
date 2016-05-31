const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const Docs = require('../Docs');
const indexingTaskName = 'docs:indexing';

module.exports = (settings) => {

  const indexingTasks = [];
  Object.keys(settings.pages).forEach(pageId => {
    const page = settings.pages[pageId];
    if( !page.indexing ) return;

    const taskName = indexingTaskName + ':' + pageId;
    indexingTasks.push(taskName);
    gulp.task(taskName, () => {
      return gulp.src(page.src).
        pipe($.rename({extname: '.html'})).
        pipe(Docs.indexing({
          pageId: pageId,
          pageTitle: page.title,
          pageHref: page.href,

          indexDest: settings.indexOutputPath,
          noIndexingHref: page.noIndexingHref,

          groupingKeys: settings.groupingKeys,
          groupIndexDest: settings.groupIndexOutputPath,
          groupDocDest: settings.groupDocOutputPath,

          docDest: settings.docOutputPath
        }))
      ;
    });
  });
  gulp.task(indexingTaskName, indexingTasks);

};
