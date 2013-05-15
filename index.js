var fs = require('fs'),
	levelup = require('levelup'),
	_ = require('lodash'),
	uuid = require('node-uuid');

var connections = {};

function getConnection(dbPath) {
	if (connections[dbPath]) return connections[dbPath];
	connections[dbPath] = levelup(dbPath, {
		valueEncoding: 'json'
	});
	return connections[dbPath];
}

var createConnection = function(dbPath) {
	function Connection(dbPath) {
		this.dbPath = dbPath;
	}

	Connection.prototype.open = function() {
		this.connection = getConnection(this.dbPath);
	};

	Connection.prototype.close = function() {
		this.connection.close();
	};

	Connection.prototype.create = function(record, callback) {
		if (!_.isObject(record)) {
			var invalidArgsError = new Error('Invalid arguments.');
			if (callback) {
				return callback(invalidArgsError);
			} else {
				throw invalidArgsError;
			}
		}

		if (!record.id) record.id = uuid.v4();

		var that = this;
		this.connection.put(record.id, record, function(error) {
			if (error) {
				if (callback) {
					return callback(error);
				} else {
					throw error;
				}
			}

			that.getById(record.id, function(error, record) {
				if (error) {
					if (callback) {
						return callback(error);
					} else {
						throw error;
					}
				}
				
				if (callback) callback(null, record);
			});
		});
	};

	Connection.prototype.get = function(query, callback) {
		// Get all records
		if (arguments.length === 1 && _.isFunction(query)) {
			callback = query;
			this.getAll(function(error, records) {
				if (error) return callback(error);
				callback(null, records);
			});

		// Get one record by ID
		} else if ((_.isString(query) || _.isNumber(query) || _.has(query, 'id')) && _.isFunction(callback)) {
			var id = query.id || query;
			this.getById(id, function(error, record) {
				if (error) return callback(error);
				callback(null, record);
			});

		// Get records using query object
		} else if ((!_.has(query, 'id') && !_.isEmpty(query)) && _.isFunction(callback)) {
			this.getByQuery(query, function(error, records) {
				if (error) return callback(error);
				callback(null, records);
			});

		// Invalid arguments
		} else {
			var invalidArgsError = new Error('Invalid arguments.');
			if (callback) {
				callback(invalidArgsError);
			} else {
				throw invalidArgsError;
			}
		}
	};

	Connection.prototype.getById = function(id, callback) {
		this.connection.get(id, function(error, record) {
			if (error && error.name !== 'NotFoundError') {
				return callback(error);
			}
			if (error) {
				return callback(null, null);
			}
			callback(null, record);
		});
	};

	Connection.prototype.getAll = function(callback) {
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

	Connection.prototype.getByQuery = function(query, callback) {
		var matchedRecords = [];
		var keysToMatch = _.keys(query);

		function hasKeysAndValues(keys, source, target) {
			var isMatch = _.all(keys, function(key) {
				return source[key] === target[key];
			});
			return isMatch;
		};

		this.connection.createValueStream()
			.on('error', function(error) {
				callback(error);
			})
			.on('data', function(record) {
				if (hasKeysAndValues(keysToMatch, query, record)) {
					matchedRecords.push(record);
				}
			})
			.on('end', function() {
				callback(null, matchedRecords);
			});
	};

	Connection.prototype.update = function(record, callback) {
		if (!_.isObject(record) || !record.id) {
			var invalidArgsError = new Error('Invalid arguments.');
			if (callback) {
				return callback(invalidArgsError);
			} else {
				throw invalidArgsError;
			}
		}

		var that = this;
		this.exists(record.id, function(error, exists) {
			if (error) {
				if (callback) {
					return callback(error);
				} else {
					throw error;
				}
			}
			if (!exists) {
				var recordNotFoundError = new Error('Record not found.');
				if (callback) {
					return callback(recordNotFoundError);
				} else {
					throw recordNotFoundError;
				}
			}

			that.connection.put(record.id, record, function(error) {
				if (error) {
					if (callback) {
						return callback(error);
					} else {
						throw error;
					}
				}

				that.getById(record.id, function(error, record) {
					if (error) {
						if (callback) {
							return callback(error);
						} else {
							throw error;
						}
					}

					if (callback) callback(null, record);
				});
			});
		});
	};

	Connection.prototype.delete = function(id, callback) {
		if (!_.isString(id) && !_.isNumber(id)) {
			var invalidArgsError = new Error('Invalid arguments.');
			if (callback) {
				return callback(invalidArgsError);
			} else {
				throw invalidArgsError;
			}
		}

		var that = this;
		this.exists(id, function(error, exists) {
			if (error) {
				if (callback) {
					return callback(error);
				} else {
					throw error;
				}
			}
			if (!exists) {
				var recordNotFoundError = new Error('Record not found.');
				if (callback) {
					return callback(recordNotFoundError);
				} else {
					throw recordNotFoundError;
				}
			}

			that.connection.del(id, function(error) {
				if (error) {
					if (callback) {
						return callback(error);
					} else {
						throw error;
					}
				}

				if (callback) callback(null, true);
			});
		});
	};

	Connection.prototype.exists = function(id, callback) {
		if ((!_.isString(id) && !_.isNumber(id)) || !_.isFunction(callback)) {
			var invalidArgsError = new Error('Invalid arguments.');
			if (callback) {
				return callback(invalidArgsError);
			} else {
				throw invalidArgsError;
			}
		};

		this.getById(id, function(error, record) {
			if (error) {
				if (callback) {
					return callback(error);
				} else {
					throw error;
				}
			}
			if (!record) {
				return callback(null, false);
			}

			callback(null, true);
		});
	};

	connection = new Connection(dbPath);
	connection.open();
	return connection;
};

module.exports = createConnection;
