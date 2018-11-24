import React from 'react'
import $ from 'jquery'

class SearchButton extends React.Component {
    constructor(props) {
        super(props);

        this.searchModal = this.searchModal.bind(this)
    }

    searchModal() {
        $("#search").toggleClass("hide")
    }
    render() {
        return(
            <span
                className={`search-div${this.props.color}`}
                onClick={this.searchModal}
                >search
            </span>        
        )
    }
}

export default SearchButton;
