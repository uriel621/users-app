// var env = process.env.NODE_ENV || 'development';
// var mongoose = require('mongoose');

// if (env === 'development') {
//     process.env.PORT = 5000;
//     // process.env.MONGODB_URI = 'mongodb://localhost:27017/Authenticate';
//     mongoose.connect("mongodb://localhost:27017/Authenticate", { useNewUrlParser: true });
// }

// // else if (env === 'test') {
// //     process.env.PORT = 3000;
// //     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// // }


// getting-started.js
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/test');
mongoose.connect("mongodb://localhost:27017/Authenticate", { useNewUrlParser: true });

var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        // we're connected!
        console.log('CONNECTED')
    });