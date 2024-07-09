import React from 'react'
import Sidebar from './Sidebar'
import ChatWindow from './ChatWindow'

const ChatComponent = ({selectedUser,handleSelectUser}) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar selectedUser={selectedUser} handleSelectUser={handleSelectUser}/>
      <ChatWindow selectedUser={selectedUser}/>
    </div>
  )
}

export default ChatComponent
