'use strict';

var moveFile = require('../index');
var expect = require('expect.js');
var rimraf = require('rimraf');
var root = process.cwd();

var fs = require('fs');
var broccoli = require('broccoli');

var builder;

describe('broccoli-file-mover', function(){
  afterEach(function() {
    if (builder) {
      builder.cleanup();
    }
  });

  it('moves a file from srcFile to destFile by default', function(){
    var sourcePath = 'tests/fixtures/sample-ember-style-package';
    var tree = moveFile(sourcePath, {
      srcFile: '/lib/main.js',
      destFile: '/sample-ember-style-package.js'
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      var expected = fs.readFileSync(sourcePath + '/lib/main.js');

      expect(fs.readFileSync(dir + '/sample-ember-style-package.js')).to.eql(expected);

      expect(fs.existsSync(dir + '/lib/main.js')).to.not.be.ok();
    });
  })

  it('copies a file from srcFile to destFile', function(){
    var sourcePath = 'tests/fixtures/sample-ember-style-package';
    var tree = moveFile(sourcePath, {
      srcFile: '/lib/main.js',
      destFile: '/sample-ember-style-package.js',
      copy: true
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      var expected = fs.readFileSync(sourcePath + '/lib/main.js');

      expect(fs.readFileSync(dir + '/sample-ember-style-package.js')).to.eql(expected);
      expect(fs.readFileSync(dir + '/lib/main.js')).to.eql(expected);
    });
  })
});
