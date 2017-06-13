var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var rename = require('gulp-rename');
 
gulp.task('compress', function (cb) {
  pump([
        gulp.src('dist/lance.js'),
        uglify(),
        rename({ suffix: '.min' }),
        gulp.dest('dist')
    ],
    cb
  );
});

gulp.task('default', ['compress']);