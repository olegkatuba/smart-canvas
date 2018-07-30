const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const mongoDB = mongoose.connect('mongodb://admin:1k76wWw1@ds159121.mlab.com:59121/smart-canvas', { useNewUrlParser: true });

mongoDB.then(db => {
    console.log('Mongodb has been connected');
}).catch(err => {
    console.log('Error while trying to connect with mongodb');
});

let symbolSchema = new mongoose.Schema({
    input: {},
    output: {}
});

let Symbol = mongoose.model('symbols', symbolSchema);

module.exports = Symbol;