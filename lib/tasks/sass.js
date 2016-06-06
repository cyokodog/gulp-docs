const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

module.exports = (settings) => {
  const supportBrowsers = [ 'ie >= 9', 'ios >= 7', 'android >= 4.0' ];
  gulp.task('docs:sass', () => {
    return gulp.src([
      settings.templatePath + settings.templateAssetsPath + '/**/*.scss',
      settings.srcPath + '/**/*.scss'
    ])
    .pipe($.plumber())
    .pipe($.cached())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer(supportBrowsers))
    .pipe($.remember())
    .pipe($.chmod(644))
    .pipe($.concat('style.css'))
    .pipe($.minifyCss())
    .pipe($.rename({ extname: '.min.css' }))
    .pipe(gulp.dest(settings.docOutputPath));
  });
};
