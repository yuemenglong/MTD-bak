//{year}
function YearSelectorClass() {
    this.getInitialState = function() {
        return { year: new Date().getFullYear() };
    }
    this.render = function() {
        return jade(`
            div(className="year-selector")
                input(type="text" name="year" value={this.state.year})
                ul`,
            function() {
                return _.range(1900, 2100).map(function(item) {
                    return jade("li(key={item}) {item}");
                })
            }
        );
    }
}

var YearSelector = React.createClass(new YearSelectorClass());

module.exports = YearSelector;
