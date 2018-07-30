let express = require('express');
let brain = require('brain.js');
let app = express();

var net = new brain.NeuralNetwork();

net.train([{input: { r: 0.03, g: 0.7, b: 0.5 }, output: { black: 1 }},
    {input: { r: 0.16, g: 0.09, b: 0.2 }, output: { white: 1 }},
    {input: { r: 0.5, g: 0.5, b: 1.0 }, output: { white: 1 }}]);

app.get('/', function (req, res) {
    res.send(net.run({ r: 1, g: 0.4, b: 0 }));
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});