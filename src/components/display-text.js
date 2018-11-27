import React from 'react';

const DisplayText = props => {
    let name = props.name;
    return (
        <div id={props.class} className={props.class}>{name}</div>
    )
}

export default DisplayText;