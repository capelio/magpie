var fs = require('fs'),
	levelup = require('levelup'),
	uuid = require('node-uuid');

var connections = connections || {};

var createStash = function(stashPath) {
	var stash;

	function getConnection(stashPath) {
		if (connections[stashPath]) return connections[stashPath];
		connections[stashPath] = levelup(stashPath, {
			valueEncoding: 'json'
		});
		return connections[stashPath];
	}

	function Stash(stashPath) {
		this.stashPath = stashPath;
	}

	Stash.prototype.open = function() {
		var exists = fs.existsSync(this.stashPath);
		if (!exists) fs.mkdirSync(this.stashPath);
		this.stash = getConnection(this.stashPath);
	};

	Stash.prototype.create = function(data, callback) {
		if (!data.id) data.id = uuid.v4();

		var that = this;
		this.stash.put(data.id, data, function(error) {
			if (error && callback) {
				return callback(error);
			} else if (error) {
				throw new Error('Could not create data.');
			}

			that.get(data.id, function(error, record) {
				if (error && callback) {
					return callback(error);
				} else if (error) {
					throw new Error('Could not get data.');
				}
				
				callback(null, record);
			});
		});
	};

	Stash.prototype.put = function(key, value, callback) {
		this.stash.put(key, value, function(error) {
			if (error) {
				return callback(error);
			}
			callback(null);
		});
	};

	Stash.prototype.get = function(key, callback) {
		this.stash.get(key, function(error, record) {
			if (error && error.name === 'NotFoundError') {
				return callback(null, null);
			}
			if (error) {
				return callback(error);
			}
			callback(null, record);
		});
	};

	Stash.prototype.getAll = function(callback) {
		var allRecords = [];
		this.stash.createValueStream()
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

	Stash.prototype.del = function(key, callback) {
		this.stash.del(key, function(error) {
			if (error && error.name === 'NotFoundError') {
				return callback(null);
			}
			if (error) {
				return callback(error);
			}
			callback(null);
		});
	};

	Stash.prototype.exists = function(key, callback) {
		this.stash.get(key, function(error) {
			if (error && error.name === 'NotFoundError') {
				return callback(null, false);
			}
			if (error) {
				return callback(error);
			}
			callback(null, true);
		});
	};

	stash = new Stash(stashPath);
	stash.open();
	return stash;
};

module.exports = createStash;
