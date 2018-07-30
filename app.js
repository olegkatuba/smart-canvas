let express = require('express');
let bodyParser = require('body-parser');
let identifier = require('./identifier');

let app = express();

/*app.set('views', './views');
app.set("view engine", "hbs");*/

app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

app.post('/train', (req, res) => {
    identifier.train(req.body.data, req.body.is);
    res.send(req.body);
    console.log('added');
});

app.post('/identify', (req, res) => {
    res.send(identifier.identify(req.body));
    console.log('identified');
});

app.get('/save', (req, res) => {
    identifier.save();
    res.send('saved');
});

module.exports = app;