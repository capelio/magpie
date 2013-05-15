Magpie
======

Simple persistence for rapid prototyping. Powered by [levelup](https://github.com/rvagg/node-levelup).

![magpie image](http://www.capelio.com/images/magpie.png)

This is my first Node.js module. Currently, the module is in the very early stages of development. Implementation of the API is ongoing. **Take note: this module is NOT production ready.**

Basic usage
-----------

```js
var magpie = require('magpie'),
	db = magpie('./db');

var theOatmealBook = {
	title: "How to Tell If Your Cat Is Plotting to Kill You",
	author: "TheOatmeal.com"
};

db.create(theOatmealBook, function(error, record) {
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

### var db = magpie(path _string_ [, options]);

### db.create(data _object_ [, callback]);

Magpie is happy to generate IDs for you via [node-uuid's](https://github.com/broofa/node-uuid) `uuid.v4()` method. If you'd like to supply your own IDs, go for it. Just include an `id` property on your `data` object.

### db.get([id _string_ | query _object_, ] callback);

Get all records:

```js
db.get(function(error, records) {
	// Returns:
	[{
	  "id": "7f5d532b-8bfe-42fd-a1d3-8272e8aa7e3f",
	  "title": "How to Tell If Your Cat Is Plotting to Kill You",
	  "author": "TheOatmeal.com",
	  "createdOn": "2013-05-10T20:30:25.342Z"
	}, {
	  ...
	}]
});
```

Get a record by ID:

```js
db.get("7f5d532b-8bfe-42fd-a1d3-8272e8aa7e3f", function(error, record) {
	// Returns:
	{
	  "id": "7f5d532b-8bfe-42fd-a1d3-8272e8aa7e3f",
	  "title": "How to Tell If Your Cat Is Plotting to Kill You",
	  "author": "TheOatmeal.com",
	  "createdOn": "2013-05-10T20:30:25.342Z"
	}
});
```

Get records by author using a query object:

```js
var query = {
	author: "TheOatmeal.com"
};
db.get(query, function(error, record) {
	// Returns:
	{
		"id": "7f5d532b-8bfe-42fd-a1d3-8272e8aa7e3f",
		"title": "How to Tell If Your Cat Is Plotting to Kill You",
		"author": "TheOatmeal.com",
		"createdOn": "2013-05-10T20:30:25.342Z"
	}
});
```

### db.update(data _object_ [, callback]);

```js
var theOatmealBook = {
	"id": "7f5d532b-8bfe-42fd-a1d3-8272e8aa7e3f",
	"title": "How to Tell If Your Cat Is Plotting to Kill You",
	"author": "TheOatmeal.com",
	"isbn10": "1449410243",
	"createdOn": "2013-05-10T20:30:25.342Z"
}
db.update(theOatmealBook, function(error, record) {
	// Returns
	{
		"id": "7f5d532b-8bfe-42fd-a1d3-8272e8aa7e3f",
		"title": "How to Tell If Your Cat Is Plotting to Kill You",
		"author": "TheOatmeal.com",
		"isbn10": "1449410243",
		"createdOn": "2013-05-10T20:30:25.342Z",
		"updatedOn": "2013-05-11T12:45:50.700Z"
	}
});
```

### db.delete(id _string_ | query _object_ [, callback]);

### db.exists(id _string_, callback);

### db.getById(id _string_, callback);

### db.getAll(callback);

### db.getByQuery(query _object_, callback);

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
