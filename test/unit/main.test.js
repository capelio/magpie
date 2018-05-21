import test from 'tape'
import _ from 'lodash'
import Magpie from '../../index.js'

test('exports a function', t => {
  t.plan(1)

  t.equal(typeof Magpie, 'function')
})

test('returns a DB', t => {
  t.plan(2)

  const db = Magpie()

  t.ok(_.has(db, 'collection'))
  t.ok(_.isFunction(db.collection))
})

test('returns a collection', t => {
  t.plan(4)

  const db = Magpie()
  const books = db.collection('books')

  t.ok(_.isFunction(books.get))
  t.ok(_.isFunction(books.put))
  t.ok(_.isFunction(books.search))
  t.ok(_.isFunction(books.delete))
})

test('throws an error when required params are missing', t => {
  t.plan(3)

  const db = Magpie()
  const books = db.collection('books')

  t.throws(books.get)
  t.throws(books.put)
  t.throws(books.delete)
})
