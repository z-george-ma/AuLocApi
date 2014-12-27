var gulp = require('gulp');
var del = require('del');
var run = require('gulp-run');

gulp.task('copy', ['clean'], function() {
  return gulp.src(['src/**/*'])
             .pipe(gulp.dest('build'));
  
});

gulp.task('clean', function(cb) {
  del(['build', 'output'], cb);
});

gulp.task('export', ['copy'], function(cb) {
  run('npm install && node export', {cwd:'build'}).exec(cb);
});

gulp.task('test', ['export'], function(cb) {
  run('npm run test', {cwd:'build'}).exec(cb);
});

gulp.task('build', ['test'], function(cb) {
  gulp.src(['build/*.js', 'build/*.json', 'build/postcodes.sqlite'])
      .pipe(gulp.dest('output'))
      .on('end', function() {
        gulp.src(['src/config/production.json'])
            .pipe(gulp.dest('output/config'))
            .on('end', function() {
              gulp.src(['Dockerfile'])
                  .pipe(gulp.dest('output/'))
                  .on('end', function() {
                    run('docker build -t aulocapi . && docker save aulocapi | gzip > ../docker.tar.gz', {cwd:'output'}).exec(cb);
                  });
            });
      });
  
});

