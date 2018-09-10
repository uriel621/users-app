var mongoose = require('mongoose');

var Authenticate = mongoose.model('Authenticate', {
    logged_in: {
        type: Boolean,
        default: false
    }
});

module.exports = { Authenticate }
