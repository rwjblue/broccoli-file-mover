var fs = require('fs');
var path = require('path');
var Writer = require('broccoli-writer');
var helpers = require('broccoli-kitchen-sink-helpers')

Mover.prototype = Object.create(Writer.prototype);
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
  helpers.copyRecursivelySync(
    path.join(directory, source),
    path.join(directory, destination));

  if (!leaveOriginal) { fs.unlinkSync(path.join(directory, source)); }
};

Mover.prototype.write = function (readTree, destDir) {
  var self = this

  return readTree(this.inputTree).then(function (srcDir) {
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
  })
};

module.exports = Mover;
