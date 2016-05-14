var DatePicker = React.createClass({
    render: function() {
        return jade(`
    		div(className="date-picker")
    			table
	    			thead
	    				tr #{}
	    			tbody 
	    				tr #{}`,
            function() {
                ["日", "一", "二", "三", "四", "五", "六"].map(function(item) {
                    return jade("th {item}");
                })
            },
            function() {
                [1, 2, 3, 4, 5, 6, 7].map(function(item) {
                    return jade("td {item}");
                });
            })
    }
})

module.exports = DatePicker;
