import React from 'react'

function MessageOthers  ()  {
    var props ={name:"others", message:"sample"}
    // var props ={name:"self", message:"sample"}
    return (
        <div className="message-wrapper">
            <div className="con-icon">{props.name[0]}</div>
            <div className="messageothers-container">
                <div className="othermessage-box">
                    <p className="con-title">{props.name}</p>
                    <p className="con-lastMessage">{props.message}</p>
                    <p className="self-timeStamp">12:00pm</p>
                </div>
            </div>
        </div>
    );
}

export default MessageOthers
