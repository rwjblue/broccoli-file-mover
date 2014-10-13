# Broccoli's File Mover

**This project has been replaced by [broccoli-funnel](https://github.com/rwjblue/broccoli-funnel). Please see migration process below.**

[![Build Status](https://travis-ci.org/rjackson/broccoli-file-mover.svg?branch=master)](https://travis-ci.org/rjackson/broccoli-file-mover)

## Migrating to broccoli-funnel

Instead of the following:

```javascript
var tree = moveFile('packages/ember-metal/lib', {
  srcFile: 'main.js',
  destFile: '/ember-metal.js'
});
```

You would use:

```javascript
var tree = new Funnel('packages/ember-metal/lib', {
  destDir: 'ember-metal',

  getDestinationPath: function(relativePath) {
    if (relativePath === 'main.js') {
      return 'ember-metal.js';
    }

    return relativePath;
  }
});
```

## Installation

```bash
npm install --save-dev broccoli-file-mover
```

## Usage

Moving a single file from `app/main` to `app`:

```javascript
var moveFile = require('broccoli-file-mover');

var tree = moveFile('app', {
  srcFile: 'app/main.js',
  destFile: '/app.js'
});
```

Moving `app/main` to `app` and `test/main` to `test`:

```javacript
var moveFile = require('broccoli-file-mover');

var tree = moveFile('app', {
  files: {
    'app/main.js': 'app.js',
    'test/main.js': 'test.js'
  }
});
```

## Documentation

### `moveFile(inputTree, options)`

---

`options.srcFile` *{String}*

The path of the file to move (starting location).

---

`options.destFile` *{String}*

The path to move the file to (final location).

---

`options.files` *{Array|Object}*

This allows specifying more than one move/copy operation at a time (and reduced the total number of trees/steps
needed if you need to move many files).

 - If `files` is an object the key is used as the source path, and the value is the destination path.
 - If `files` is an array each item must be an object with a `srcFile` and `destFile` property. If `copy` is present it will
   be used also.

## ZOMG!!! TESTS?!?!!?

I know, right?

Running the tests:

```javascript
npm install
npm test
```

## License

This project is distributed under the MIT license.
