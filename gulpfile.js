const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const runSequence = require('run-sequence');
const browserSync = require('browser-sync');
const fs = require('fs-extra');
const Docs = require('./index');

const settings = {

  index: {
    outputPath: './docs/dest/_index',
    indexing: true,
    noIndexingHref: [],
    indexingOnlyHref: [],
    indexTitle: 'contents'
  },

  indexTitle: 'CONTENTS',


  docOutputPath: './docs/dest',
  indexOutputPath: './docs/dest/_index',
  templatePath: './docs/theme/default',
  groupIndexOutputPath: './docs/dest/_group',
  groupDocOutputPath: './docs/__temp/group_doc',
  // groupingKeys: ['category'],
  groupingKeys: {
    category: {
      title: 'CATEGORY'
    }
  },
  groupTemplateFile: 'list.html',
  pages: {
    // blog: {
    //   templateFile: 'blog.html',
    //   src: [
    //     './docs/src/**/blog/**/*.md',
    //     '!./docs/src/**/blog/index.md'
    //   ],
    //   indexing: true
    // },
    // top: {
    //   templateFile: 'blog.html',
    //   src: [
    //     './docs/src/**/blog/index.md',
    //     './docs/src/**/profile/index.md'
    //   ],
    //   indexing: true
    // },

    blog: {
      templateFile: 'post.html',
      src: [
        './docs/src/**/blog/**/*.md'
      ],
      indexing: true,
      noIndexingHref: [
        '/blog/index.html'
      ]
    },

    profile: {
      templateFile: 'page.html',
      src: [
        './docs/src/**/profile/**/*.md'
      ],
      indexing: true,
      noIndexingHref: [
        '/profile/index.html'
      ]
    },


    page: {
      templateFile: 'page.html',
      src: [
        './docs/src/*.md',
        './docs/src/**/blog/index.md',
        './docs/src/**/profile/index.md'
      ],
      indexingOnlyHref: [
        '/blog/index.html',
        '/profile/index.html'
      ],
      indexing: true
    }
  }
};

//settings.groupingKeys.forEach(key => {
Object.keys(settings.groupingKeys).forEach(key => {
  settings.pages[key] = {
    templateFile: settings.groupTemplateFile,
    src: [settings.groupDocOutputPath + '/**/*.md'],
    indexing: false
  }
});




const indexPages = Object.keys(settings.pages).filter(pageId => {
  const page = settings.pages[pageId];
  return page.indexing;
});



const indexingTaskName = 'docs:indexing';
const indexingTasks = [];
Object.keys(settings.pages).forEach(pageId => {
  const page = settings.pages[pageId];
  if( !page.indexing ) return;

  const docs = new Docs();
  const taskName = indexingTaskName + ':' + pageId;
  indexingTasks.push(taskName);
  gulp.task(taskName, cb => {
    return gulp.src(page.src).
      pipe($.rename({extname: '.html'})).
      pipe(docs.indexing({
        pageId: pageId,
        indexDest: settings.indexOutputPath,
        noIndexingHref: page.noIndexingHref,
        indexTitle: settings.indexTitle,


        groupingKeys: settings.groupingKeys,
        groupIndexDest: settings.groupIndexOutputPath,
        groupDocDest: settings.groupDocOutputPath,

        docDest: settings.docOutputPath

      }))
    ;
  });
});
gulp.task(indexingTaskName, indexingTasks);




const renderTaskName = 'docs:render';
const renderTasks = [];
Object.keys(settings.pages).forEach(pageId => {
  const page = settings.pages[pageId];

const cond = (file) => {

  if( !page.indexingOnlyHref ) return true;

  const href = '/' + file.path.split(file.base)[1];
  console.log('/' + file.path.split(file.base)[1])


  return !(page.indexingOnlyHref.some(v => v === href));
};



  const docs = new Docs();
  const taskName = renderTaskName + ':' + pageId;
  renderTasks.push(taskName);
  gulp.task(taskName, cb => {
    return gulp.src(page.src).
      pipe($.rename({extname: '.html'})).
      pipe(docs.render({
        templateFile: page.templateFile,
        templatePath: settings.templatePath,
        indexPath: settings.indexOutputPath,
        indexPages: indexPages,

indexingOnlyHref: page.indexingOnlyHref,
indexing: page.indexing,


        pageId: pageId,
        groupingKeys: settings.groupingKeys,
        groupIndexDest: settings.groupIndexOutputPath,
      })).
      // pipe(gulp.dest(settings.docOutputPath))
      pipe($.if(cond, gulp.dest(settings.docOutputPath)))
    ;
  });
});
gulp.task(renderTaskName, renderTasks);


const buildTaskName = 'docs:build';
gulp.task(buildTaskName, cb => {
  runSequence('docs:cleanDest',indexingTaskName, renderTaskName, cb);
});


gulp.task(
  'docs:cleanDest',
  function (cb) {
    fs.removeSync( settings.docOutputPath );
    fs.removeSync( settings.groupDocOutputPath );
    cb();
  }
);

gulp.task(
  'docs:serve', () => {
    browserSync({
      server: {
        baseDir: settings.docOutputPath
      }
    });
  }
);

gulp.task(
  'default',
  function (cb) {
    runSequence('docs:cleanDest',buildTaskName, 'docs:serve', cb);
  }
);

