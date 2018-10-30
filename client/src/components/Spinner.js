import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import {ScaleLoader}  from 'react-spinners';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

class Spinner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }
    
    render() {
        return (
            <div className="loading">
                <CircularProgress size={70} />
            </div>
        )
    }
        
}

export default Spinner;