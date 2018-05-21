import fs from "fs";
import _ from "lodash";
import lmdb from "node-lmdb";
import { ulid } from "ulid";

let env;
const collections = {};

function wrapCollection(collection) {
  return {
    get(id) {
      if (!id) throw new Error("Must provide an ID");

      const txn = env.beginTxn();
      const record = txn.getString(collection, id);
      txn.commit();

      return JSON.parse(record);
    },

    put(record) {
      if (!record) throw new Error("Must provide a record");

      const txn = env.beginTxn();
      const baseRecord = _.isNil(record.id)
        ? { id: ulid() }
        : JSON.parse(txn.getString(collection, record.id));
      _.merge(baseRecord, record);
      txn.putString(collection, baseRecord.id, JSON.stringify(baseRecord));
      txn.commit();

      return baseRecord;
    },

    search(options = {}) {
      const { count = 25, where = {} } = options;
      const records = [];

      const txn = env.beginTxn();
      const cursor = new lmdb.Cursor(txn, collection);
      for (
        let id = cursor.goToFirst();
        id !== null && records.length !== count;
        id = cursor.goToNext()
      ) {
        const record = JSON.parse(txn.getString(collection, id));
        if (_.isMatch(record, where)) records.push(record);
      }
      txn.commit();

      return records;
    },

    delete(id) {
      if (!id) throw new Error("Must provide an ID");

      const txn = env.beginTxn();
      txn.del(collection, id);
      txn.commit();

      // TODO: return false if delete does not succeed
      return true;
    }
  };
}

function wrapEnv() {
  return {
    collection(name) {
      if (!collections[name]) {
        collections[name] = env.openDbi({ name, create: true })
      }

      return wrapCollection(collections[name]);
    }
  };
}

export default (options = {}) => {
  const { path = "db" } = options;

  try {
    fs.statSync(path);
  } catch (error) {
    if (error.code === "ENOENT") fs.mkdirSync(path);
  }

  if (!env) {
    env = new lmdb.Env();
    env.open({ path });
  }

  return wrapEnv();
};
