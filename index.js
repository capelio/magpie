var fs = require('fs'),
	levelup = require('levelup'),
	_ = require('lodash'),
	uuid = require('node-uuid');

var connections = {};

var createStash = function(dbPath) {
	var stash;

	function getConnection(dbPath) {
		if (connections[dbPath]) return connections[dbPath];
		connections[dbPath] = levelup(dbPath, {
			valueEncoding: 'json'
		});
		return connections[dbPath];
	}

	function Stash(dbPath) {
		this.dbPath = dbPath;
	}

	Stash.prototype.open = function() {
		this.connection = getConnection(this.dbPath);
	};

	Stash.prototype.close = function() {
		this.connection.close();
	};

	Stash.prototype.create = function(data, callback) {
		if (!data.id) data.id = uuid.v4();

		var that = this;
		this.connection.put(data.id, data, function(error) {
			if (error && callback) {
				return callback(error);
			} else if (error) {
				throw new Error('Could not create data.');
			}

			that.getById(data.id, function(error, record) {
				if (error && callback) {
					return callback(error);
				} else if (error) {
					throw new Error('Could not get data.');
				}
				
				callback(null, record);
			});
		});
	};

	Stash.prototype.get = function(query, callback) {
		// Get all records
		if (arguments.length === 1 && _.isFunction(query)) {
			callback = query;
			this.getAll(function(error, records) {
				if (error) return callback(error);
				callback(null, records);
			});

		// Get one record by ID
		} else if ((_.isString(query) || _.has(query, 'id')) && _.isFunction(callback)) {
			var key = query.id || query;

			this.getById(key, function(error, record) {
				if (error) return callback(error);
				callback(null, record);
			});

		// Get records using query object
		} else if ((!_.has('id') && !_.isEmpty(query)) && _.isFunction(callback)) {
			callback(new Error('Get using query object not yet implemented.'));

		// Invalid arguments
		} else {
			var error = new Error('Invalid arguments.');
			if (callback) {
				callback(error);
			} else {
				throw error;
			}
		}
	};

	Stash.prototype.getById = function(key, callback) {
		this.connection.get(key, function(error, record) {
			if (error && error.name !== 'NotFoundError') {
				return callback(error);
			}
			if (error) {
				return callback(null, null);
			}
			callback(null, record);
		});
	};

	Stash.prototype.getAll = function(callback) {
		var allRecords = [];
		this.connection.createValueStream()
			.on('error', function(error) {
				callback(error);
			})
			.on('data', function(record) {
				allRecords.push(record);
			})
			.on('end', function() {
				callback(null, allRecords);
			});
	};

	stash = new Stash(dbPath);
	stash.open();
	return stash;
};

module.exports = createStash;
