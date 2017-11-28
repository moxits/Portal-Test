var mongoose = require('mongoose');

var chartSchema = mongoose.Schema({
    name: String,
    filled: Array,
});
module.exports = mongoose.model('Charts', chartSchema);