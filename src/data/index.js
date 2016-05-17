var data = require("./2001.json");

function Data() {
    this.getData = function(from, to) {
        return data;
    }
}

module.exports = new Data();