const brain = require('brain.js');
const maxMin = require('../max-min');
const fs = require('fs');
const data = require('./data');
const Symbol = require('./db');

class Identifier {

    constructor() {
        this.net = new brain.NeuralNetwork();
        Symbol.find()
            .lean()
            .then(data => {
                this.data = data;// .map(i => ({input: i.input, output: i.output}))
                this.net.trainAsync(this.data)
                    .then(() => {
                        console.log('trained');
                    })
                    .catch(() => {
                        console.log('error');
                    });
            })
    }

    train(data, number) {
        new Symbol({ input: data, output: {[number]: 1} }).save();
        // this.data.push({output: {[number]: 1}, input: data});
    }

    save() {
        this.net = new brain.NeuralNetwork();
        return Symbol.find()
            .lean()
            .then(data => {
                this.data = data;
                return this.net.trainAsync(this.data);
            });
    }

    identify(data) {
        return this.net.run(data);
    }
}

module.exports = new Identifier();





