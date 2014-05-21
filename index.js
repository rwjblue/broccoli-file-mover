var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var CachingWriter = require('broccoli-caching-writer');
var helpers = require('broccoli-kitchen-sink-helpers')

Mover.prototype = Object.create(CachingWriter.prototype);
Mover.prototype.constructor = Mover;
function Mover (inputTree, options) {
  if (!(this instanceof Mover)) return new Mover(inputTree, options);

  this.inputTree = inputTree;
  this.files     = options.files;
  this.srcFile   = options.srcFile;
  this.destFile  = options.destFile;
  this.copy      = options.copy;
};

Mover.prototype._copyFile = function (directory, source, destination, leaveOriginal) {
  var sourcePath = path.join(directory, source);
  var destinationPath = path.join(directory, destination);

  rimraf.sync(destinationPath);
  helpers.copyRecursivelySync(sourcePath, destinationPath);

  if (!leaveOriginal) { rimraf.sync(sourcePath); }
};

Mover.prototype.updateCache = function (srcDir, destDir) {
  var self = this;

  helpers.copyRecursivelySync(srcDir, destDir);

  if (Array.isArray(self.files)) {
    self.files.forEach(function(file) {
      self._copyFile(destDir, file.srcFile, file.destFile, file.copy);
    });
  } else if (self.files) {
    for (var key in self.files) {
      if (self.files.hasOwnProperty(key)) {
        self._copyFile(destDir, key, self.files[key], self.copy);
      }
    }
  } else {
    self._copyFile(destDir, self.srcFile, self.destFile, self.copy);
  }
};

module.exports = Mover;
