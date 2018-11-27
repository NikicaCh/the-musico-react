import React from 'react';

const Song = props => {
    return (
        <ul class="list-group list-group-flush">
            {/* <a href={`spotify:track: ${props.details.id}`}></a> */}
            <li className="list-group-item song-name ">{props.details.name}
            <p className="font-italic text-muted">{props.details.artistName}</p>
            </li>
            
        </ul>
    )
}

export default Song;