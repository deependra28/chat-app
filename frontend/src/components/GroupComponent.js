import React from 'react'
import ChatGroupSidebar from './ChatGroupSidebar'
import ChatGroupWindow from './ChatGroupWindow'

const GroupComponent = ({handleSelectGroup, selectedGroup,selectedUser}) => {
  return (
    <div>
        <div className="flex h-screen bg-gray-100">
     <ChatGroupSidebar handleSelectGroup={handleSelectGroup} />
     <ChatGroupWindow selectedGroup={selectedGroup} selectedUser={selectedUser}/>
    </div>
    </div>
  )
}

export default GroupComponent
