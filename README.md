Magpie
======

Simple persistence for rapid prototyping, powered by leveldb.

![magpie image](http://www.capelio.com/images/magpie.png)

This is my first Node.js module. Currently, the module is in the very early stages of development. Implementation of the API is ongoing. **Take note: this module is NOT production ready.**

Basic usage
-----------

```js
var magpie = require('magpie'),
	favoriteThings = magpie('./db/favoriteThings');

var theOatmealBook = {
	title: "How to Tell If Your Cat Is Plotting to Kill You",
	author: "TheOatmeal.com"
};

favoriteThings.create(theOatmealBook, function(err, record) {
	// Returns:
	// {
	//   "id": "7f5d532b-8bfe-42fd-a1d3-8272e8aa7e3f",
	//   "title": "How to Tell If Your Cat Is Plotting to Kill You",
	//   "author": "TheOatmeal.com",
	//   "createdOn": "2013-05-10T20:30:25.342Z"
	// }
});
```

API
---

### var db = magpie('filesystem path'[, options]);

### db.create(data[, callback]);

- creating without an ID
- creating with an ID

Magpie is happy to generate IDs for you via [node-uuid's](https://github.com/broofa/node-uuid) `uuid.v4()` method.

If you'd like to supply your own IDs, go for it. Just include an `id` property on your `data` object.

### db.fetch(query[, callback]);

- fetching by ID
- fetching by query object

### db.update(data[, callback]);

- updating by ID
- updating without an ID

### db.destroy(id[, callback]);

- destroying by ID

License
-------

MIT. See the LICENSE file.
