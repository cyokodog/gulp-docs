const gulp = require('gulp');

module.exports = (settings) => {
  gulp.task('docs:assets', () => {
    return gulp.src([
      '!' + settings.templatePath + settings.templateAssetsPath + '/**/*.scss',
      '!' + settings.srcPath + '/**/*.scss',
      '!' + settings.templatePath + settings.templateAssetsPath + '/**/*.js',
      '!' + settings.srcPath + '/**/*.js',
      '!' + settings.templatePath + settings.templateAssetsPath + '/**/*.md',
      '!' + settings.srcPath + '/**/*.md',
      settings.templatePath + settings.templateAssetsPath + '/**/*',
      settings.srcPath + '/**/*'
    ])
    .pipe(gulp.dest(settings.docOutputPath));
  });
};
