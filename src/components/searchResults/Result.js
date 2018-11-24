import React from 'react';

const Result = props => {
    return (
        <div className="col-lg-4 mt-5">
            <a href={`${props.uri}`} target="_blank"><img className={`${props.type}-image`} src={`${props.image}`} alt="song"></img></a>
                <p className="song-name card-text mt-4">{props.name}</p>
            </div>
    )
}

export default Result;
