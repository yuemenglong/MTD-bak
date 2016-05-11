var _ = require("lodash");
var fs = require("fs");

var content = fs.readFileSync("./2001.csv").toString();
var lines = content.match(/.+/g);

var res = lines.map(function(line) {
    var items = line.split(",");
    var match = items[0].match(/(\d{4})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2})/);
    var ret = {};
    ret.datetime = new Date(match[1], match[2], match[3], match[4], match[5], 0).toLocaleString();
    ret.open = parseFloat(items[1]);
    ret.high = parseFloat(items[2]);
    ret.low = parseFloat(items[3]);
    ret.close = parseFloat(items[4]);
    return ret;
})
var output = JSON.stringify(res, null, "  ");
console.log(output);
fs.writeFileSync("./2001.json", output);
