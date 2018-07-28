const mongoose = require('mongoose');

// Set the Mongoose Promise with the JS global Promise
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

module.exports = { mongoose }