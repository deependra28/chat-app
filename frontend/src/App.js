import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import RegistrationForm from './components/RegistrationForm'; // Assuming this component exists for routing
import { users } from './data/dummyData'; // Import dummy data
import ChatComponent from './components/ChatComponent';
import LoginForm from './components/LoginForm';
import GroupComponent from './components/GroupComponent';

function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleSelectUser = (user) => {
    console.log(user);
    setSelectedUser(user);

  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setSelectedUser(null);
  };

  return (
    <Router>
      <div >
        <Routes>
          <Route path="/" element={<LoginForm/>} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/chat" element={<ChatComponent selectedUser={selectedUser} handleSelectUser={handleSelectUser} />} />
          <Route path="/group" element={<GroupComponent handleSelectGroup={handleSelectGroup} selectedGroup={selectedGroup} selectedUser={selectedUser} />}/>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

const ChatLayout = ({ selectedUser, handleSelectUser }) => (
  <>
    <Sidebar onSelectUser={handleSelectUser} /> {/* Pass onSelectUser function */}
    <ChatWindow selectedUser={selectedUser} />
  </>
);

export default App;
