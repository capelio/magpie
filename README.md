Magpie
======

Simple persistence for rapid prototyping. Powered by leveldb.

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

The MIT License (MIT)

Copyright (c) 2013 C. Corey Capel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
