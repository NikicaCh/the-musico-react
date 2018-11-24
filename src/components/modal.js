import React from 'react';
import $ from 'jquery';

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trackName: '',
            array: [],
            index: 5,
        }
    }

    componentDidMount() {
        $(".under-modal:not('.modal-window'):not(.frame)").on("click", () => {
           $(".modals").toggleClass('hide')
        })
        let lyrics = this.props.lyrics;
        let array = [];
        let id=0;
        lyrics.map((verse) => {
            id++;
            const parag = <div className="parag" id={id}>{verse}</div>
            array.push(parag)
            this.setState({array: array})
        })
    }


    
    render() {
        return(
            <div className="modals hide">
                <div className="under-modal"></div>
                <div className="modal-window">
                    <form>
                        <h2>{this.props.trackName}</h2>
                        <textarea
                            className="parag-input"
                            cols="50"
                            rows="30"
                            >{this.props.lyrics[this.state.index]}
                        </textarea>
                    </form>
                </div>
                <div className="frame">
                    {this.state.array}
                </div>
            </div>
        )
    }
}

export default Modal;