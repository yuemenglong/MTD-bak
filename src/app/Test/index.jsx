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

function renderPnr(pnr){
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
    this.render = function() {
        return jade(`
            div(className="book-result")
            `,
            renderLegTable(this.props.legs));
    }
}

module.exports = connect()(React.createClass(new TestClass()));
module.exports.reducer = reducer;
