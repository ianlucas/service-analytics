const glob = require('glob');

function readdir(cwd) {
  return new Promise((resolve) => {
    glob('**/*.js', {
      cwd,
      ignore: 'node_modules/**/*.js',
    }, (err, files) => {
      if (err) {
        return resolve([]);
      }
      return resolve(files);
    });
  });
}

module.exports = readdir;
