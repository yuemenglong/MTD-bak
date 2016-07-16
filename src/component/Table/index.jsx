var React = require("react");
var ReactDOM = require("react-dom");
var _ = require("lodash");

require("./style.less");

//{header[], body[[],[]], }
function TableClass() {
    this.getDefaultProps = function() {
        return {};
    }
    this.getColPrev = function(i, j) {
        if (i == 0) return;
        return this.props.body[i - 1][j];
    }
    this.getRowPrev = function(i, j) {
        if (j == 0) return;
        return this.props.body[i][j - 1];
    }
    this.getColNext = function(i, j) {
        if (i == this.props.body.length - 1) return;
        return this.props.body[i + 1][j];
    }
    this.getRowNext = function(i, j) {
        if (j == this.props.body[i].length - 1) return;
        return this.props.body[i][j + 1];
    }
    this.getColSpan = function(i, j) {
        var item = this.props.body[i][j];
        var colspan = 1;
        for (var k = j + 1; k < this.props.body[i].length; k++) {
            if (item == this.props.body[i][k]) {
                colspan++;
            }
        }
        return colspan;
    }
    this.getRowSpan = function(i, j) {
        var item = this.props.body[i][j];
        var rowspan = 1;
        for (var k = i + 1; k < this.props.body.length; k++) {
            if (item == this.props.body[k][j]) {
                rowspan++;
            }
        }
        return rowspan;
    }
    this.renderHeader = function() {
        if (!this.props.header) return;
        return jade("tr", function() {
            return this.props.header.map(function(item, i) {
                return jade("th(key={i}) {item}");
            })
        }.bind(this))

    }
    this.renderBody = function() {
        if (!this.props.body) return;
        return this.props.body.map(function(row, i) {
            return jade("tr(key={i})", function() {
                return row.map(function(item, j) {
                    var colspan = 1;
                    var rowspan = 1;
                    if (this.props.colspan && this.props.colspan.indexOf(i) >= 0) {
                        if (item == this.getRowPrev(i, j)) {
                            return;
                        }
                        colspan = this.getColSpan(i, j);
                    }
                    if (this.props.rowspan && this.props.rowspan.indexOf(j) >= 0) {
                        if (item == this.getColPrev(i, j)) {
                            return;
                        }
                        rowspan = this.getRowSpan(i, j);
                    }
                    var props = {};
                    if (colspan > 1) props.colSpan = colspan;
                    if (rowspan > 1) props.rowSpan = rowspan;
                    return jade("td(key={j} {...props}) {item}");
                }.bind(this)).filter(function(item) {
                    return item !== undefined;
                })
            }.bind(this))
        }.bind(this))
    }
    this.render = function() {
        return jade(`
    		table(className={this.props.className} style={this.props.style})
    			thead
    				|{this.renderHeader()}
    			tbody
    				|{this.renderBody()}
    		`);
    }
}

module.exports = React.createClass(new TableClass());
