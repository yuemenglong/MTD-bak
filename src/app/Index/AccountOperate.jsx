var _ = require("lodash");
var React = require("react");
var ReactRedux = require("react-redux");
var Provider = ReactRedux.Provider;
var connect = ReactRedux.connect;

var dataAction = require("./reducer/data").action;
var ordersAction = require("./reducer/orders").action;
var accountAction = require("./reducer/account").action;

function renderSelectAccount() {
    var that = this;
    return jade("select(onChange={this.onSelectAccount} value={this.props.current.id})", function() {
        var ret = that.props.accounts.map(function(account) {
            return jade("option(value={account.id} key={account.id}) {account.name}");
        })
        ret.unshift(jade("option(key='') 请选择"));
        return ret;
    })
}

function AccountOperateClass() {
    this.renderSelectAccount = renderSelectAccount;
    this.getDefaultProps = function() {
        return { accounts: [], current: { name: "", balance: 0 } };
    }
    this.onAddAccount = function() {
        this.props.dispatch(accountAction.addAccount());
    }
    this.onUpdateAccount = function(e) {
        this.props.dispatch(accountAction.updateAccount(e.target.name, e.target.value));
    }
    this.onDeleteAccount = function(e) {
        this.props.dispatch(accountAction.deleteAccount(this.props.current.id));
    }
    this.onSelectAccount = function(e) {
        this.props.dispatch(accountAction.selectAccount(e.target.value));
    }
    this.render = function() {
        return jade(`
            div
                input(type="text" name="name" placeholder="账户名称" value={this.props.current.name} onChange={this.onUpdateAccount})
                input(type="text" name="balance" placeholder="账户资金" value={this.props.current.balance} onChange={this.onUpdateAccount})
                a(href="javascript:void(0)" onClick={this.onAddAccount}) 添加
                |{this.renderSelectAccount()}
                a(href="javascript:void(0)" onClick={this.onDeleteAccount}) 删除
            `);
    }
}

function mapStateToProps(state) {
    return state.account;
}

var AccountOperate = React.createClass(new AccountOperateClass());
module.exports = connect(mapStateToProps)(AccountOperate);
