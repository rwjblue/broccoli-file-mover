var fs = require('fs');
var path = require('path');
var Writer = require('broccoli-writer');
var helpers = require('broccoli-kitchen-sink-helpers')

Mover.prototype = Object.create(Writer.prototype);
Mover.prototype.constructor = Mover;
function Mover (inputTree, options) {
  if (!(this instanceof Mover)) return new Mover(inputTree, options);

  this.inputTree = inputTree;
  this.srcFile   = options.srcFile;
  this.destFile  = options.destFile;
  this.copy      = options.copy;
};

Mover.prototype.write = function (readTree, destDir) {
  var self = this

  return readTree(this.inputTree).then(function (srcDir) {
    helpers.copyRecursivelySync(srcDir, destDir);
    helpers.copyRecursivelySync(
      path.join(destDir, self.srcFile),
      path.join(destDir, self.destFile));

    if (!self.copy) { fs.unlinkSync(path.join(destDir, self.srcFile)); }
  })
};

module.exports = Mover;
