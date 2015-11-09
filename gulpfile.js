var gulp = require('gulp'),
    gulpless = require('gulp-less');

gulp.task('less', function(){
	gulp.src('./public/css/*.less')
        .pipe(less())
        .pipe(gulp.dest('.build/css'));
});
gulp.task('default', function(){
});
