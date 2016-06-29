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
    return jade("select", function() {
        var ret = that.props.accounts.map(function(account) {
            return jade("option(value={account.id} key={account.id}) {account.name}");
        })
        ret.unshift(jade("option(key='none') 请选择"));
        return ret;
    })
}

function AccountOperateClass() {
    this.renderSelectAccount = renderSelectAccount;
    this.addAccount = function() {
        this.props.dispatch(accountAction.addAccount());
    }
    this.getDefaultProps = function() {
        return { accounts: [] };
    }
    this.render = function() {
        return jade(`
            div
                input(type="text" name="name" placeholder="账户名称")
                input(type="text" name="balance" placeholder="账户资金")
                a(href="#" onClick={this.addAccount}) 添加
                |{this.renderSelectAccount()}
            `);
    }
}

var AccountOperate = React.createClass(new AccountOperateClass());

module.exports = connect()(AccountOperate);
