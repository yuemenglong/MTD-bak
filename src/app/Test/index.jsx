var _ = require("lodash");
var React = require("react");
var ev = require("../../common/event");
var kit = require("../../common/kit");

require("./style.less");

ev.globalHook(function() {
    console.log(_.assign({}, arguments));
})

function TicketClass() {
    this.getDefaultProps = function() {
        return { ev: ev };
    }
    this.onChange = function(e) {
        var kv = _.zipObject([e.target.name], [e.target.value]);
        this.props.ev.event(_.assign({}, this.props.ticket, kv));
    }
    this.onClickDelete = function() {
        this.props.ev.emit("DELETE");
    }
    this.render = function() {
        return jade(`
            div
                input(type="text" name="name" value={this.props.name} onChange={this.onChange})
                input(type="text" name="value" value={this.props.value} onChange={this.onChange})
                a(href="javescript:void(0);" onClick={this.onClickDelete}) x
            `);
    }
}

var Ticket = React.createClass(new TicketClass());

function TicketsClass() {
    this.getDefaultProps = function() {
        return { ev: ev, tickets: [] };
    }
    this.onChangeTicket = function(idx, ticket) {
        var tickets = this.props.tickets.map(function(t, i) {
            return idx == i ? ticket : t;
        })
        this.props.ev.event(tickets);
    }
    this.onClickAddTicket = function() {
        var tickets = this.props.tickets.concat([kit.keyObject()]);
        this.props.ev.event(tickets);
    }
    this.onDeleteTicket = function(idx) {
        var tickets = this.props.tickets.filter(function(t, i) {
            return i != idx;
        })
        this.props.ev.event(tickets);
    }
    this.render = function() {
        return jade("div", function() {
            return this.props.tickets.map(function(ticket, i) {
                var ev = this.props.ev
                    .fork(this.onChangeTicket.bind(null, i))
                    .on("DELETE", this.onDeleteTicket.bind(null, i));
                return jade(`Ticket(key={ticket._key} ticket={ticket} ev={ev})`);
            }.bind(this)).concat([jade("button(key='add' onClick={this.onClickAddTicket}) add")]);
        }.bind(this))
    }
}

var Tickets = React.createClass(new TicketsClass());

function TestClass() {
    this.getDefaultProps = function() {
        return { tickets: [{}, {}], ev: ev };
    }
    this.getInitialState = function() {
        var state = _.cloneDeep({ tickets: this.props.tickets });
        kit.keyObject(state);
        return state;
    }
    this.onChange = function(tickets) {
        console.log(JSON.stringify(tickets));
        this.setState({ tickets: tickets });
    }
    this.render = function() {
        var ev = this.props.ev.fork(this.onChange);
        return jade(`
            Tickets(ev={ev} tickets={this.state.tickets})
            `);
    }
}

module.exports = React.createClass(new TestClass());
