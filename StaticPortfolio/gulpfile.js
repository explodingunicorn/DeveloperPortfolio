var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var concat = require("gulp-concat");

gulp.task("build", function () {
    return gulp.src(["./scripts/projects.js", "./scripts/graph.js", "./scripts/main.js"])
        .pipe(concat("main.js"))
        .pipe(gulp.dest("./"));
});

gulp.task('less', function () {
    return gulp.src('./less/main.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./css'));
});

gulp.task('watch', function() {
    gulp.watch('./less/**/*.less', ['less']);
    gulp.watch('./scripts/**/*.js', ['build']);
});

gulp.task('default', ['less']);
