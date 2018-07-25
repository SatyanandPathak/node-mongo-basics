const mongoose = require('mongoose');

// Set the Mongoose Promise with the JS global Promise
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });

module.exports = { mongoose }