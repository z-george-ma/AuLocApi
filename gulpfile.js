var gulp = require('gulp');
var del = require('del');
var run = require('gulp-run');

gulp.task('setup', ['clean'], function(cb) {
  gulp.src(['src/*.js', 'src/*.json'])
      .pipe(gulp.dest('build'));
  
  gulp.src(['src/config/**'])
      .pipe(gulp.dest('build/config'));

  gulp.src(['src/test/**'])
      .pipe(gulp.dest('build/test'));

  cb();
});

gulp.task('clean', function(cb) {
  del(['build', 'output'], cb);
});

gulp.task('export', ['setup'], function(cb) {
  run('cd build && npm install && node export').exec(cb);
});

gulp.task('test', ['export'], function(cb) {
  run('cd build && npm run test').exec(cb);
});

gulp.task('build', ['test'], function(cb) {
  gulp.src(['build/*.js', 'build/*.json', 'build/postcodes.sqlite'])
      .pipe(gulp.dest('output'));
  
  gulp.src(['src/config/production.json'])
      .pipe(gulp.dest('output/config'));

  gulp.src(['Dockerfile'])
      .pipe(gulp.dest('output/'));

  run('docker build -t aulocapi . && docker save aulocapi | gzip > docker.tar.gz').exec(cb);

});

