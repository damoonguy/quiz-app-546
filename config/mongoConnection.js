import { MongoClient } from 'mongodb';
import { mongoConfig } from './settings.js';

let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
  console.log('HELP')
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl).then(console.log).catch(console.error);
    _db = _connection.db(mongoConfig.database);
  }

  return _db;
};

const closeConnection = async () => {
  await _connection.close();
};

export { dbConnection, closeConnection };