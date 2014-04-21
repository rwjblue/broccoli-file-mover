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
