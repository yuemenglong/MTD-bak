var React = require("react");
var ReactDOM = require("react-dom");
var Window = require("./container/Window");
var OrderTable = require("./container/Window/OrderTable");

module.exports = { app: jade("Window"), store: Window.store };
// module.exports = jade("Svg(width='100' height='100' paths={paths})");

if (require.main == module) {
    var server = require("react-dom/server");
    var orders = [{ id: 1, price: 10, volumn: 0.2, createTime: new Date(), type: "BUY" }];
    var app = jade("OrderTable")
    var html = server.renderToStaticMarkup(app);
    console.log(html);
}
