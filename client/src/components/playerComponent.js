import React, {Component} from 'react';
import '../App.css';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Slider from 'material-ui/Slider';
import {accessToken, SeekPosition} from './Fetch';


export class PlayerSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
          min: 0,
          max: 10000,
          power: 0.3,
          slider: 0,
        }
        this.setState({max: this.props.max})
    this.handleSlider = this.handleSlider.bind(this);
    this.transform = this.transform.bind(this);
    this.reverse = this.reverse.bind(this);
    }
    handleSlider(event, value) {
        let token = accessToken();
        this.setState({slider: this.transform(value)});
        SeekPosition(token, value);
    };
    transform(value) {
      return Math.round((Math.exp(this.state.power * value / this.state.max) - 1) / (Math.exp(this.state.power) - 1) * this.state.max);
    }
    
    reverse(value) {
      return (1 / this.state.power) * Math.log(((Math.exp(this.state.power) - 1) * value / this.state.max) + 1) * this.state.max;
    }
    componentWillReceiveProps(props) {
      this.setState({max: props.max})
    }
    render() {
        return (
          <div>
            <MuiThemeProvider>
            <Slider
              min={this.state.min}
              max={this.state.max}
              step={1}
              value={this.reverse(this.state.slider)}
              onChange={this.handleSlider}
            />
            </MuiThemeProvider>
            <p>
              <span className="lead text-muted">{'The value of this slider is: '}</span>
              <span className="lead text-muted">{this.state.slider}</span>
            </p>
          </div>
        );
      }
    

}
