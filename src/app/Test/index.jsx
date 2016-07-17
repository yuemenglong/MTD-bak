var _ = require("lodash");
var React = require("react");
var Todo = require("../../component/Todo");
var EventEmitter = require("events").EventEmitter;
var Redux = require("redux");
var ReactRedux = require("react-redux");
var connect = ReactRedux.connect;
var moment = require("moment");

var reducer = require("./reducer");
var todoAction = require("./reducer/todo").action;
var Table = require("../../component/Table");
var Modal = require("../../component/Modal");

require("./style.less");

var headers = ["company", "lineNo", "from", "to", "startTime", "endTime"];

function renderLegHeader() {
    return jade("tr", function() {
        return headers.map(function(item) {
            return jade("td {item}");
        })
    })
}

function renderLeg(leg) {
    return jade("tr", function() {
        return headers.map(function(item) {
            return jade("td {leg[item]}");
        })
    })
}

function renderLegs(legs) {
    return legs.map(renderLeg);
}

function renderLegTable(legs) {
    return jade(`
        table(className="table ticket")
            thead #{}
            tbody #{}
        `,
        renderLegHeader(),
        renderLegs(legs)
    );
}

function renderPnr(pnr) {
    return jade(`
        div
            span 定位编码
            br
            span pnr
        `);
}

function TestClass() {
    this.getDefaultProps = function() {
        return {
            pnr: "12345",
            legs: [{
                lineNo: 981,
                company: "CA",
                from: "PEK",
                to: "JFK",
                startTime: moment().format("YYYY-MM-DD"),
                endTime: moment().format("YYYY-MM-DD"),
            }, {
                lineNo: 982,
                company: "UA",
                from: "JFK",
                to: "SFO",
                startTime: moment().format("YYYY-MM-DD"),
                endTime: moment().format("YYYY-MM-DD"),
            }]
        }
    }
    this.renderPnr = function(pnr) {
        return jade(`
            span
                input(type="checkbox")
                |{pnr}
            `);
    }
    this.renderPrice = function(current, total) {
        return jade(`
            span
                input(type="text" value={current})
                |/{total}
            `);
    }
    this.renderTable = function() {
        var objectHeader = ["lineNo", "company", "from", "to", "startTime", "endTime"]
        var header = _.flatten(["定位编码", objectHeader, "支付价格"]);
        var pnr = this.renderPnr(this.props.pnr);
        var price = this.renderPrice(50, 100);
        var body = this.props.legs.map(function(leg) {
            var objectField = _.values(leg);
            var ret = [pnr, objectField, price];
            return _.flatten(ret);
        }.bind(this));
        return jade(`
            Table(className="table cch-table cch-book" body={body} rowspan={[0, 7]})
            `);
    }
    this.renderCustom = function() {
        return jade("Table(className='table cch-table' header={['Y/X/C', '1203123123']})");
    }
    this.renderPanel = function() {
        return jade(`
            div(className="panel cch-panel panel-primary")
                //- div(className="panel-heading") heading 
                div(className="panel-body") {this.renderCustom()}
                |{this.renderTable()}
                //- div(className="panel-body")
                div(className="panel-heading") heading 
                |{this.renderTable()}
            `);
    }
    this.renderTableInnerTable = function() {
        var innerTable = jade(`
               div
                    span(className="cch-justify") 1
                    span(className="cch-justify") 2
                    span(className="cch-justify") 3
            `);
        var body = [
            [innerTable, 4, 5]
        ];
        return jade(`
            Table(className="table cch-table", body={body})
            `);
    }
    this.renderFilter = function() {
        var body = [
            ["firstName", jade("input(type='text')"), "lastName", jade("input(type='text')")],
        ]
        return jade("Table(className='table cch-table cch-filter' body={body})");
    }
    this.render = function() {
        return jade(`
            Modal 
                |{this.renderPanel()}
                |{this.renderFilter()}
            `)
    }
}

module.exports = connect()(React.createClass(new TestClass()));
module.exports.reducer = reducer;
