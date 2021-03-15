'use strict';
// import React, {useState} from 'react';
// import {Button} from '@material-ui/core'

class LikeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { liked: false };
    }

    render() {
        if (this.state.liked) {
            return 'hello! react!';
        }

        return (
            <button onClick={() => this.setState({ liked: true }) }>
        Like
        </button>
    );
    }
}

let domContainer = document.querySelector('#react_topBar');
ReactDOM.render(<LikeButton/>, domContainer);