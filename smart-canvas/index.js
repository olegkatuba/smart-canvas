const brain = require('brain.js');
const maxMin = require('../max-min');
const fs = require('fs');
const data = require('./data');

class SmartCanvas {

    constructor() {
        this.net = new brain.NeuralNetwork();
        this.data = data;
        this.net.trainAsync(this.data)
            .then(() => {
                console.log('trained');
            })
            .catch(() => {
                console.log('error');
            });
    }

    train(data, number) {
        this.data.push({ output: {[number]: 1}, input: data });
    }

    save() {
        require('fs').writeFile('./identifier/data.json', JSON.stringify(this.data), (err, data) => {
            err ? console.log('err') : console.log('saved');
        });
    }

    identify(data) {
        return this.net.run(data);
    }
}

module.exports = new Identifier();





