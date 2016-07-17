var React = require("react");
var ReactDOM = require("react-dom");
var _ = require("lodash");

require("./style.less");

//{header[], body[[],[]], }
function ModalClass() {
    this.render = function() {
        return jade(`
            div(className="container cch-modal")
                |{this.props.children}
                div(className="btn-group cch-modal-btn")
                    button(className="btn btn-lg btn-primary") 确定
                    button(className="btn btn-lg btn-default") 取消
            `);
    }
}

module.exports = React.createClass(new ModalClass());
