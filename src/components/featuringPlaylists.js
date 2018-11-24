import React from 'react'


class FeaPlaylists extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        return(
            <div className="row featuring-playlists-row">
                <div className="col-md-3">
                    <img src="https://images.unsplash.com/photo-1541328088513-80ed7704b8f2?ixlib=rb-0.3.5&s=ab820d192fe68798c1780350b21d73bb&auto=format&fit=crop&w=1951&q=80"></img>
                    <h3> Name </h3>
                </div>
                <div className="col-md-3">
                    <img src="https://images.unsplash.com/photo-1541328088513-80ed7704b8f2?ixlib=rb-0.3.5&s=ab820d192fe68798c1780350b21d73bb&auto=format&fit=crop&w=1951&q=80"></img>
                    <h3> Name </h3>
                </div>
                <div className="col-md-3">
                    <img src="https://images.unsplash.com/photo-1541328088513-80ed7704b8f2?ixlib=rb-0.3.5&s=ab820d192fe68798c1780350b21d73bb&auto=format&fit=crop&w=1951&q=80"></img>
                    <h3> Name </h3>
                </div>
                <div className="col-md-3">
                    <img src="https://images.unsplash.com/photo-1541328088513-80ed7704b8f2?ixlib=rb-0.3.5&s=ab820d192fe68798c1780350b21d73bb&auto=format&fit=crop&w=1951&q=80"></img>
                    <h3> Name </h3>
                </div>    
            </div>
        )
    }
}

export default FeaPlaylists;