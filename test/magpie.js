/**
 * Dependencies
 */

var should = require('should'),
	_ = require('lodash'),
	magpie = require('../index.js');

/**
 * Fixtures
 */

var stashPath = './collection';

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
	var db = magpie(stashPath);

	describe('constructor', function() {
		it('should open a connection after the constructor is called', function() {
			db.should.have.property('stashPath', stashPath);
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
});
