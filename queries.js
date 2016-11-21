var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/blog';
var db = pgp(connectionString);

// add query functions

module.exports = {
  getAllMessages: getAllMessages,
  getSingleMessage: getSingleMessage,
  removeMessage: removeMessage,
  createleMessage: createleMessage,
  updateMessage: updateMessage
};