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

var theOatmealBookWithId = _.clone(theOatmealBook);
theOatmealBookWithId = {
	id: "978-1449410247"
};

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
		it('should create an ID when one is not provided', function(done) {
			db.create(theOatmealBook, function(error, record) {
				record.should.have.property('id');
				done();
			});
		});

		it('should use an existing ID when one is provided', function(done) {
			db.create(theOatmealBookWithId, function(error, record) {
				record.should.have.property('id', theOatmealBookWithId.id);
				done();
			});
		});
	});

	describe('#get', function() {
		it('should return a record when querying for an ID as a string', function(done) {
			db.get(theOatmealBookWithId.id, function(error, record) {
				record.should.have.property('id', theOatmealBookWithId.id);
				done();
			});
		});

		it('should not return a record when querying for a non-existant ID as a string', function(done) {
			db.get('idThatDoesNotExist', function(error, record) {
				should.not.exist(record);
				done();
			});
		});

		it('should return a record when querying for an ID on a query object', function(done) {
			db.get({id: theOatmealBookWithId.id}, function(error, record) {
				record.should.have.property('id', theOatmealBookWithId.id);
				done();
			});
		});

		it('should not return a record when querying for a non-existant ID on a query object', function(done) {
			db.get({id: 'idThatDoesNotExist'}, function(error, record) {
				should.not.exist(record);
				done();
			});
		});

		it('should return all records when only supplying a callback', function(done) {
			db.get(function(error, records) {
				records.should.not.be.empty;
				done();
			});
		});
	});
});
