var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var Writer = require('broccoli-writer');
var symlinkOrCopySync = require('symlink-or-copy').sync;

function Mover (inputTree, options) {
  if (!(this instanceof Mover)) return new Mover(inputTree, options);

  options = options || {};
  this.inputTree = inputTree;

  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      this[key] = options[key]
    }
  }
};

Mover.prototype.constructor = Mover;
Mover.prototype = Object.create(Writer.prototype);

Mover.prototype._copyFile = function (sourceDirectory, destinationDirectory, source, destination) {
  var sourcePath = path.join(sourceDirectory, source);
  var destinationPath = path.join(destinationDirectory, destination);
  var destinationDirname = path.dirname(destinationPath);

  rimraf.sync(destinationPath);
  if (!fs.existsSync(destinationDirname)) {
    mkdirp.sync(destinationDirname);
  }

  symlinkOrCopySync(sourcePath, destinationPath);
};

Mover.prototype.write = function (readTree, destDir) {
  var self = this;

  return readTree(this.inputTree).then(function(srcDir) {
    if (Array.isArray(self.files)) {
      self.files.forEach(function(file) {
        self._copyFile(srcDir, destDir, file.srcFile, file.destFile);
      });
    } else if (self.files) {
      for (var key in self.files) {
        if (self.files.hasOwnProperty(key)) {
          self._copyFile(srcDir, destDir, key, self.files[key]);
        }
      }
    } else {
      self._copyFile(srcDir, destDir, self.srcFile, self.destFile);
    }
  });
};

module.exports = Mover;
