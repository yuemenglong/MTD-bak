var _ = require("lodash");
var orm = require("yy-orm");
var uuid = require("node-uuid");
var moment = require("moment");
var type = orm.type;
var cond = orm.cond;
var db = orm.create({ host: 'localhost', user: 'root', password: 'root', database: 'test' })

var Order = db.define("orders", {
    id: type.varchar(64).pkey(),
    type: type.varchar(16).notNull(),
    price: type.double().notNull(),
    volumn: type.double().notNull(),
    stopLoss: type.double(),
    stopWin: type.double(),
    createTime: type.datetime().notNull(),
    openTime: type.datetime(),
    openPrice: type.double(),
    closeTime: type.datetime(),
    closePrice: type.double(),
    profit: type.double(),
    status: type.varchar(16).notNull(),
})

db.build();

var service = {};

service.sendOrder = function(order) {
    order.id = uuid.v1();
    return Order.insert(order);
}

service.updateOrder = function(order) {
    return Order.update(order);
}

service.listOrder = function() {
    return Order.select().then((orders) => orders.map(transDate));
}

service.delete = function(id) {
    return Order.delete({ id: id });
}

function transDate(obj) {
    return _.mapValues(obj, o => _.isDate(o) ? moment(o).format("YYYY-MM-DD HH:mm:ss") : o);
}

module.exports = service;
