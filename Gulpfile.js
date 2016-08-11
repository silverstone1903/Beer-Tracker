var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', function() {
  gulp.src('app.spec.js')
    .pipe(mocha())
});

gulp.watch('**/*.js', ['test']);
