var mysql = require('mysql');
var Promise = require("bluebird");
var fs = require("fs");
var _ = require("lodash");

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test'
});

connection.connect();

function query(sql) {
    console.log(sql);
    return new Promise(function(resolve, reject) {
        connection.query(sql, function(err, rows, fields) {
            if (err) {
                reject(err);
            } else {
                resolve({ rows, fields });
            }
        })
    })
}

function getBars(year) {
    var content = fs.readFileSync(`./raw/${year}.csv`).toString();
    var lines = content.match(/.+/g);

    var res = lines.map(function(line) {
        var items = line.split(",");
        var match = items[0].match(/(\d{4})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2})/);
        var ret = {};
        ret.datetime = new Date(match[1], match[2] - 1, match[3], match[4], match[5], 0).toLocaleString();
        ret.open = parseFloat(items[1]);
        ret.high = parseFloat(items[2]);
        ret.low = parseFloat(items[3]);
        ret.close = parseFloat(items[4]);
        return ret;
    })
    return res;
}

Promise.try(function() {
    return query("truncate table bar");
}).then(function() {
    return Promise.each(_.range(2001, 2017), function(year) {
        var bars = getBars(year);
        return Promise.each(bars, function(bar) {
            var sql = mysql.format("insert into bar set ?", bar);
            return query(sql);
        })
    })
}).then(function() {

}).then(function() {

}).finally(function() {
    connection.end();
})
