const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const Docs = require('../Docs');
const renderTaskName = 'docs:render';
module.exports = (settings) => {

  const renderTasks = [];
  Object.keys(settings.pages).forEach(pageId => {
    const page = settings.pages[pageId];

    const condition = (file) => {
      if( !page.indexingOnlyHref ) return true;
      const href = '/' + file.path.split(file.base)[1];
      return !(page.indexingOnlyHref.some(v => v === href));
    };

    const taskName = renderTaskName + ':' + pageId;
    renderTasks.push(taskName);

    gulp.task(taskName, () => {
      return gulp.src(page.src).
        pipe($.rename({extname: '.html'})).
        pipe($.if(condition, $.cached())).
        pipe($.using()).
        pipe(Docs.render({
          templateFile: page.templateFile,
          templatePath: settings.templatePath,
          indexPath: settings.indexOutputPath,
          indexPages: settings.indexPages,

          indexingOnlyHref: page.indexingOnlyHref,
          indexing: page.indexing,

          pageId: pageId,
          pageTitle: page.title,
          pageHref: page.href,

          groupingKeys: settings.groupingKeys,
          groupIndexDest: settings.groupIndexOutputPath
        })).
        pipe($.if(condition, gulp.dest(settings.docOutputPath)))
      ;
    });
  });
  gulp.task(renderTaskName, renderTasks);
};
