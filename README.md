<p align="center">
  <img src="http://www.capelio.com/images/magpie.jpg">
</p>

Rationale
---------

When iterating over a new user experience, at a certain point it becomes valuable to be able to persist data. The effort to setup and maintain a proper database, however, can be burdensome. That's where Magpie comes in. Simply install the module and use it. Magpie takes care of creating a file-based database on disk and providing an API that covers the majority of database use cases.

Basic Usage
-----------

```js
import Magpie from 'magpie'

const db = Magpie()
const books = db.collection('books')

books.put({
  title: "How to Tell If Your Cat Is Plotting to Kill You",
  author: "TheOatmeal.com"
})

// Returns the created record. Note the ID and createdAt timestamp.
{
  "id": "01CE0X4JTP6A87C3703VVN8WGZ",
  "title": "How to Tell If Your Cat Is Plotting to Kill You",
  "author": "TheOatmeal.com",
  "createdAt": "2018-05-10T20:30:25.342Z"
}
```

API
---

### const db = Magpie([options _object_])

### const collection = db.collection(name _string_)

### collection.put(record _object_)

The `put` method works like an `UPSERT` from the SQL world. In short, if your record has an `id` key, Magpie will `update` the existing record. If you record lacks an `id` key, Magpie will create an entirely new record instead.

Magpie will generate IDs for you via the [ulid](https://www.npmjs.com/package/ulid) module. If you'd like to supply your own IDs, go for it. Just include an `id` property on your record.

When updating, you can update as few or as many properties as you'd like.

```js
books.put({
  "id": "01CE0X4JTP6A87C3703VVN8WGZ",
  "isbn10": "1449410243"
})

// Returns the updated record. Note the new updatedAt property.
{
  "id": "01CE0X4JTP6A87C3703VVN8WGZ",
  "title": "How to Tell If Your Cat Is Plotting to Kill You",
  "author": "TheOatmeal.com",
  "isbn10": "1449410243",
  "createdAt": "2018-05-10T20:30:25.342Z",
  "updatedAt": "2018-05-11T12:45:50.700Z"
}
});
```

### collection.get(id _string_)

```js
books.get("01CE0X4JTP6A87C3703VVN8WGZ")

// Returns:
{
  "id": "01CE0X4JTP6A87C3703VVN8WGZ",
  "title": "How to Tell If Your Cat Is Plotting to Kill You",
  "author": "TheOatmeal.com",
  "createdAt": "2018-05-10T20:30:25.342Z",
  "updatedAt": "2018-05-11T12:45:50.700Z"
}
});
```

### collection.search([options _object_])

### collection.delete(id _string_);
