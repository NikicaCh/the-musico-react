import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Modal from './modal';


class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    // this.showModal = this.showModal.bind(this);
  }
  componentDidMount() {

  }
  // showModal () {
  //   const node = document.getElementById('for-modals')
  //   ReactDOM.unmountComponentAtNode(node)
  //   const track = this.props.track;
  //   const lyrics = this.props.lyrics;
  //   let array = [];
  //   lyrics.map((verse) => {
  //     let paragraph = '';
  //     verse.props.children.map((row) => {
  //       paragraph = paragraph + row.props.children + "\n";
  //     })
  //     array.push(paragraph);
  //   })
  //   const element = <Modal
  //     trackName={track} 
  //     lyrics={array}
  //   />;
  //   ReactDOM.render(
  //     element,
  //     document.getElementById('for-modals')
  //   );
  //   $(".modals").toggleClass('hide')
  // }

  render() {
    return (
        <div className="dropdown hide">
            <button
              className="dropdown-item"
              onClick={this.props.reportLyrics()}>Report bad lyrics
            </button>
            {/* <button
              className="dropdown-item"
              onClick={this.showModal}>Suggest Lyrics
            </button> */}
        </div>
    )
  }
}

export default DropDown;