var mocha = require('jake-mocha'),
	path = require('path');
	
desc('Setup task.');
task('setup', function () {
  jake.mkdirP('build');
  jake.cpR('src', 'build');
});


mocha.defineTask({
	name: 'test',
	files: 'src/test/**/*.js',
	prerequisites: [],
	mochaOptions: {
		ui: 'bdd',
		reporter: 'spec'
	}
});

