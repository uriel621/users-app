var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// mongoose.connect(process.env.MONGODB_URI);
mongoose.connect("mongodb://localhost:27017/Authenticate", { useNewUrlParser: true });

module.exports = { mongoose };
