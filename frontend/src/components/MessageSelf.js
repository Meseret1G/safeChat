import React from 'react'

const MessageSelf = () => {
    var props2={name:"self",message:"sample"}
  return (
    <div className='messageself-container'>
      <div className='messageBox'>
        <p>{props2.message}</p>
        <p className="self-timeStamp">12:00</p>
      </div>
    </div>
  )
}

export default MessageSelf