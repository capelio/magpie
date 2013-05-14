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

var bookWithStringId = {
	id: "978-1449410247"
};
bookWithStringId = _.merge(bookWithStringId, theOatmealBook);

var bookWithNumberId = {
	id: 100
};
bookWithNumberId = _.merge(bookWithNumberId, theOatmealBook);

var updatedBook = {
	isbn10: "1449410243"
};
updatedBook = _.merge(updatedBook, bookWithStringId);

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
				if (error) throw error;
				record.should.have.property('id');
				done();
			});
		});

		it('should use an existing string ID when one is provided', function(done) {
			db.create(bookWithStringId, function(error, record) {
				if (error) throw error;
				record.should.have.property('id', bookWithStringId.id);
				done();
			});
		});

		it('should use an existing number ID when one is provided', function(done) {
			db.create(bookWithNumberId, function(error, record) {
				if (error) throw error;
				record.should.have.property('id', bookWithNumberId.id);
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
			db.get(bookWithStringId.id, function(error, record) {
				if (error) throw error;
				record.should.have.property('id', bookWithStringId.id);
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

		it('should return a record when querying for an ID as a number', function(done) {
			db.get(bookWithNumberId.id, function(error, record) {
				if (error) throw error;
				record.should.have.property('id', bookWithNumberId.id);
				done();
			});
		});

		it('should return a record when querying for an ID on a query object', function(done) {
			db.get({id: bookWithStringId.id}, function(error, record) {
				if (error) throw error;
				record.should.have.property('id', bookWithStringId.id);
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

	describe('#update', function() {
		// TODO: it should
		// - return a InvalidArguments error when no ID provided
		// - return a RecordNotFound error when ID does not exist

		it('should return an error when no ID provided', function(done) {
			var badRecord = { foo: 'bar' };
			db.update(badRecord, function(error) {
				should.exist(error);
				done();
			});
		});

		it('should return an error when an ID does not exist', function(done) {
			var nonExistantRecord = { id: 'doesNotExist' };
			db.update(nonExistantRecord, function(error) {
				should.exist(error);
				done();
			});
		});

		it('should return the updated record', function(done) {
			db.update(updatedBook, function(error, record) {
				if (error) throw error;
				record.should.have.property('isbn10', updatedBook.isbn10);
				done();
			});
		});
	});

	describe('#delete', function() {
		// TODO: it should
		// - return a InvalidArguments error when no ID provided
		// - return a RecordNotFound error when ID does not exist

	 it('should return an error when no ID provided', function(done) {
		 db.delete('', function(error, succeeded) {
			 should.exist(error);
			 done();
		 });
	 });

	 it('should return an error when an ID does not exist', function(done) {
		 db.delete('doesNotExist', function(error, succeeded) {
			 should.exist(error);
			 done();
		 });
	 });

	 it('should return true if the delete succeeded', function(done) {
		 db.delete(updatedBook.id, function(error, succeeded) {
			 if (error) throw error;
			 succeeded.should.be.true;
			 done();
		 });
	 });
	});

	after(function() {
		db.close();
	})
});
