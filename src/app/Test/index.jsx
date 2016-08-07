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
    this.getInitialState = function() {
        return { ext: false };
    }
    this.onChange = function(e) {
        var ticket = _.cloneDeep(this.props.ticket);
        ticket[e.target.name] = e.target.value;
        this.props.ev.event({ ticket: ticket });
    }
    this.onClickDelete = function() {
        this.props.ev.emit("DELETE");
    }
    this.onClickExt = function() {
        var ext = !this.state.ext;
        this.setState({ ext: ext });
    }
    this.renderExt = function() {
        if (this.state.ext) {
            return jade(`input(type="text" name="ext" value={this.props.ext} onChange={this.onChange})`);
        }
    }
    this.render = function() {
        var ticket = this.props.ticket;
        return jade(`
            div
                input(type="text" name="name" value={ticket.name} onChange={this.onChange})
                input(type="text" name="value" value={ticket.value} onChange={this.onChange})
                a(href="javescript:void(0);" onClick={this.onClickDelete}) x
                a(href="javescript:void(0);" onClick={this.onClickExt}) ext
                |{this.renderExt()}
            `);
    }
}

var Ticket = React.createClass(new TicketClass());

function TicketsClass() {
    this.getDefaultProps = function() {
        return { ev: ev, tickets: [] };
    }
    this.onChangeTicket = function(idx, props) {
        var ticket = props.ticket;
        var tickets = this.props.tickets.map(function(t, i) {
            return idx == i ? ticket : t;
        })
        this.props.ev.event({ tickets: tickets });
    }
    this.onClickAddTicket = function() {
        var tickets = this.props.tickets.concat([kit.keyObject()]);
        this.props.ev.event({ tickets: tickets });
    }
    this.onDeleteTicket = function(idx) {
        var tickets = this.props.tickets.filter(function(t, i) {
            return i != idx;
        })
        this.props.ev.event({ tickets: tickets });
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
    // this.getDefaultProps = function() {
    //     // return { tickets: [{}, {}], ev: ev };
    // }
    // this.getInitialState = function() {
    //     // var state = _.cloneDeep({ tickets: this.props.tickets });
    //     // kit.keyObject(state);
    //     // return state;
    // }
    this.componentDidMount = function() {
        ev.event(this.onEvent);
    }
    this.onEvent = function(state) {
        console.log(JSON.stringify(state));
        this.setState(state);
    }
    this.render = function() {
        // var ev = this.props.ev.fork(this.onChange);
        return jade(`
            Tickets({...this.state})
            `);
    }
}

function reducer(state, action) {
    state = state || {};
    return state;
}

module.exports = React.createClass(new TestClass());
