# Broccoli's File Mover

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

## ZOMG!!! TESTS?!?!!?

I know, right?

Running the tests:

```javascript
npm test
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

`options.copy` *{true,false}*

Should the file be copied?

 - If `copy` is `true`, then the source file is left in the tree (this might be useful to output both a non-minified and minified version).
 - If `copy` is `false`, then the source file is removed after it has been copied (essentially making this a `move` operation).

`options.files` *{Object}*

Provides an object where the key is the source path, and the value is the destination path. This allows specifying more than one
move/copy operation at a time (and reduced the total number of trees/steps needed if you need to move many files).

## License

This project is distributed under the MIT license.
