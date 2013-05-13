/**
 * Dependencies
 */

var should = require('should'),
	_ = require('lodash'),
	magpie = require('../index.js');

/**
 * Fixtures
 */

var dbPath = './db';

var theOatmealBook = {
	title: "How to Tell If Your Cat Is Plotting to Kill You",
	author: "TheOatmeal.com"
};

var bookWithId = {
	id: "978-1449410247"
};
bookWithId = _.merge(theOatmealBook, bookWithId);

var updatedBook = {
	isbn10: "1449410243"
};
updatedBook = _.merge(bookWithId, updatedBook);

/**
 * Tests
 */

describe('Magpie', function() {
	var db = magpie(dbPath);

	describe('constructor', function() {
		it('should open a connection after the constructor is called', function() {
			db.connection.should.have.property('location', dbPath);
		});
	});

	describe('#create', function() {
		// TODO: it should
		// - return a InvalidArguments error if the record is not an object

		it('should return an error if the record is not an object', function(done) {
			db.create('this is not an object', function(error, record) {
				should.exist(error);
				done();
			});
		});

		it('should create an ID when one is not provided', function(done) {
			db.create(theOatmealBook, function(error, record) {
				record.should.have.property('id');
				done();
			});
		});

		it('should use an existing ID when one is provided', function(done) {
			db.create(bookWithId, function(error, record) {
				record.should.have.property('id', bookWithId.id);
				done();
			});
		});
	});

	describe('#get', function() {
		// TODO: it should
		// - return a InvalidArguments error when improperly called
		// - look at idThatDoesNotExist again, should we test for the existence of an error? also, do we need
		//   to test when there is as well as when there isn't a callback?

		it('should return a record when querying for an ID as a string', function(done) {
			db.get(bookWithId.id, function(error, record) {
				record.should.have.property('id', bookWithId.id);
				done();
			});
		});

		it('should not return a record when querying for a non-existant ID as a string', function(done) {
			db.get('doesNotExist', function(error, record) {
				if (error) throw error;
				should.not.exist(record);
				done();
			});
		});

		it('should return a record when querying for an ID on a query object', function(done) {
			db.get({id: bookWithId.id}, function(error, record) {
				if (error) throw error;
				record.should.have.property('id', bookWithId.id);
				done();
			});
		});

		it('should not return a record when querying for a non-existant ID on a query object', function(done) {
			db.get({id: 'doesNotExist'}, function(error, record) {
				if (error) throw error;
				should.not.exist(record);
				done();
			});
		});

		it('should return all records when only supplying a callback', function(done) {
			db.get(function(error, records) {
				if (error) throw error;
				records.should.not.be.empty;
				done();
			});
		});
	});

	after(function() {
		db.close();
	})
});
