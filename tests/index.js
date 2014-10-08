'use strict';

var moveFile = require('../index');
var expect = require('expect.js');
var rimraf = require('rimraf');
var root = process.cwd();

var fs = require('fs');
var broccoli = require('broccoli');

var builder;

process.setMaxListeners(12);

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

  it('moves a directory from srcFile to destFile by default', function(){
    var sourcePath = 'tests/fixtures/sample-ember-style-package';
    var tree = moveFile(sourcePath, {
      srcFile: '/lib',
      destFile: '/other'
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      var main = fs.readFileSync(sourcePath + '/lib/main.js');
      var core = fs.readFileSync(sourcePath + '/lib/core.js');

      expect(fs.readFileSync(dir + '/other/main.js')).to.eql(main);
      expect(fs.readFileSync(dir + '/other/core.js')).to.eql(core);

      expect(fs.existsSync(dir + '/lib')).to.not.be.ok();
    });
  });

  it('can create a file in a directory that didn\'t previously exist', function(){
    var sourcePath = 'tests/fixtures/sample-ember-style-package';
    var tree = moveFile(sourcePath, {
      srcFile: '/lib/main.js',
      destFile: '/non-root-dir/sample-ember-style-package.js'
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      var expected = fs.readFileSync(sourcePath + '/lib/main.js');

      expect(fs.readFileSync(dir + '/non-root-dir/sample-ember-style-package.js')).to.eql(expected);
    });
  })

  it('can be used to overwrite a file', function(){
    var sourcePath = 'tests/fixtures/sample-ember-style-package';
    var tree = moveFile(sourcePath, {
      srcFile: '/lib/main.js',
      destFile: '/lib/core.js',
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      var expected = fs.readFileSync(sourcePath + '/lib/main.js');

      expect(fs.readFileSync(dir + '/lib/core.js')).to.eql(expected);

      expect(fs.existsSync(dir + '/lib/main.js')).to.not.be.ok();
    });
  })

  it('does not copy all of the inputTree', function(){
    var sourcePath = 'tests/fixtures/sample-ember-style-package';
    var tree = moveFile(sourcePath, {
      srcFile: '/lib/main.js',
      destFile: '/sample-ember-style-package.js'
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      var expected = fs.readFileSync(sourcePath + '/lib/main.js');

      expect(fs.readFileSync(dir + '/sample-ember-style-package.js')).to.eql(expected);

      expect(fs.existsSync(dir + '/lib/core.js')).to.not.be.ok();
    });
  })

  describe('accepts a hash of objects as the `file` option', function() {
    it('moves each file referenced', function(){
      var sourcePath = 'tests/fixtures/sample-ember-style-package';
      var tree = moveFile(sourcePath, {
        files: {
          '/lib/main.js': '/sample-ember-style-package.js',
          '/lib/core.js': '/some-random-thing.js'
        }
      });

      builder = new broccoli.Builder(tree);
      return builder.build().then(function(dir) {
        var main = fs.readFileSync(sourcePath + '/lib/main.js');
        var core = fs.readFileSync(sourcePath + '/lib/core.js');

        expect(fs.readFileSync(dir + '/sample-ember-style-package.js')).to.eql(main);
        expect(fs.readFileSync(dir + '/some-random-thing.js')).to.eql(core);

        expect(fs.existsSync(dir + '/lib/main.js')).to.not.be.ok();
        expect(fs.existsSync(dir + '/lib/core.js')).to.not.be.ok();
      });
    })

    it('can create a file in a directory that didn\'t previously exist', function(){
      var sourcePath = 'tests/fixtures/sample-ember-style-package';
      var tree = moveFile(sourcePath, {
        files: {
          '/lib/main.js': '/blammo/dir/sample-ember-style-package.js',
          '/lib/core.js': '/other/stupid-place/some-random-thing.js'
        }
      });

      builder = new broccoli.Builder(tree);
      return builder.build().then(function(dir) {
        var main = fs.readFileSync(sourcePath + '/lib/main.js');
        var core = fs.readFileSync(sourcePath + '/lib/core.js');

        expect(fs.readFileSync(dir + '/blammo/dir/sample-ember-style-package.js')).to.eql(main);
        expect(fs.readFileSync(dir + '/other/stupid-place/some-random-thing.js')).to.eql(core);

        expect(fs.existsSync(dir + '/lib/main.js')).to.not.be.ok();
        expect(fs.existsSync(dir + '/lib/core.js')).to.not.be.ok();
      });
    })
  });

  describe('accepts an array of objects as the `file` option', function() {
    it('does not delete eagerly (allowing the same file to be used repeatedly)', function(){
      var sourcePath = 'tests/fixtures/sample-ember-style-package';
      var tree = moveFile(sourcePath, {
        files: [
          {srcFile: '/lib/main.js', destFile: '/sample-ember-style-package.js'},
          {srcFile: '/lib/main.js', destFile: '/some-other-file.js'},
          {srcFile: '/lib/core.js', destFile: '/wat.js'}
        ]
      });

      builder = new broccoli.Builder(tree);
      return builder.build().then(function(dir) {
        var expected = fs.readFileSync(sourcePath + '/lib/main.js');
        var core = fs.readFileSync(sourcePath + '/lib/core.js');

        expect(fs.readFileSync(dir + '/sample-ember-style-package.js')).to.eql(expected);
        expect(fs.readFileSync(dir + '/some-other-file.js')).to.eql(expected);
        expect(fs.readFileSync(dir + '/wat.js')).to.eql(core);

        expect(fs.existsSync(dir + '/lib/main.js')).to.not.be.ok();
        expect(fs.existsSync(dir + '/lib/core.js')).to.not.be.ok();
      });
    })
  });

  describe('copy (not symlink) files using "copy" option', function() {
    it('when specifying single file', function(){
      var sourcePath = 'tests/fixtures/sample-ember-style-package';
      var tree = moveFile(sourcePath, {
        srcFile: '/lib/main.js',
        destFile: '/sample-ember-style-package.js',
        copy: true
      });

      builder = new broccoli.Builder(tree);
      return builder.build().then(function(dir) {
        expect(fs.statSync(dir + '/sample-ember-style-package.js').isFile()).to.be.ok();
      });
    });

    it('when specifying files map', function(){
      var sourcePath = 'tests/fixtures/sample-ember-style-package';
      var tree = moveFile(sourcePath, {
        files: {
          '/lib/main.js': '/sample-ember-style-package.js',
          '/lib/core.js': '/wat.js'
        },
        copy: true
      });

      builder = new broccoli.Builder(tree);
      return builder.build().then(function(dir) {
        expect(fs.statSync(dir + '/sample-ember-style-package.js').isFile()).to.be.ok();
        expect(fs.statSync(dir + '/wat.js').isFile()).to.be.ok();
      });
    });

    it('when specifying files array and copy for some of the files', function(done){
      var sourcePath = 'tests/fixtures/sample-ember-style-package';
      var tree = moveFile(sourcePath, {
        files: [
          {srcFile: '/lib/main.js', destFile: '/sample-ember-style-package.js'},
          {srcFile: '/lib/main.js', destFile: '/some-other-file.js', copy: true},
          {srcFile: '/lib/core.js', destFile: '/wat.js', copy: false}
        ]
      });

      builder = new broccoli.Builder(tree);
      return builder.build().then(function(dir) {
        expect(fs.statSync(dir + '/some-other-file.js').isFile()).to.be.ok();

        if (process.platform !== 'win32') {
          fs.lstat(dir + '/sample-ember-style-package.js', function (err, stats) {
            expect(stats.isSymbolicLink()).to.be.ok();
            fs.lstat(dir + '/wat.js', function (err, stats) {
              expect(stats.isSymbolicLink()).to.be.ok();
              done();
            });
          });
        } else {
          console.log('Windows platform: all files are copied (no symlinks)');
          done();
        }
      });
    });

    it('when specifying files array and copy as a global option with some overwrites', function(done){
      var sourcePath = 'tests/fixtures/sample-ember-style-package';
      var tree = moveFile(sourcePath, {
        files: [
          {srcFile: '/lib/main.js', destFile: '/sample-ember-style-package.js'},
          {srcFile: '/lib/main.js', destFile: '/some-other-file.js', copy: true},
          {srcFile: '/lib/core.js', destFile: '/wat.js', copy: false}
        ],
        copy: true
      });

      builder = new broccoli.Builder(tree);
      return builder.build().then(function(dir) {
        expect(fs.statSync(dir + '/sample-ember-style-package.js').isFile()).to.be.ok();
        expect(fs.statSync(dir + '/some-other-file.js').isFile()).to.be.ok();

        if (process.platform !== 'win32') {
          fs.lstat(dir + '/wat.js', function (err, stats) {
            expect(stats.isSymbolicLink()).to.be.ok();
            done();
          });
        } else {
          console.log('Windows platform: all files are copied (no symlinks)');
          done();
        }
      });
    });
  });
});
