import React, { useState, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import axios from 'axios';
import webSocketService from './WebSocketService'; // Adjust the import path as needed

const formatTimestamp = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString(); // Adjust formatting as needed
  };

const ChatGroupWindow = ({ selectedGroup }) => {
  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedGroup) {
        try {
          console.log(selectedGroup.id);
          const response = await axios.get(`http://localhost:8080/groups/${selectedGroup.id}/messages`);
          console.log(response.data);
        
          setMessages(response.data);
          
        //   messages.forEach(message => {
        //     message.timestamp = formatTimestamp(message.timestamp); // Format each timestamp
        //   });
        } catch (error) {
          console.error('Error fetching group messages:', error.message);
        }
      }
     
    };

    const handleReceivedMessage = (message) => {
        message.timestamp = parseInt(message.timestamp);
        setMessages((prevMessages) => [...prevMessages, message].sort((a, b) => a.timestamp - b.timestamp));
        messages.forEach(message => {
            message.timestamp = formatTimestamp(message.timestamp); // Format each timestamp
          });
    };

    if (selectedGroup) {
      fetchMessages();
      webSocketService.connect(handleReceivedMessage);
    //   webSocketService.subscribeToGroup(selectedGroup.id, handleReceivedMessage);

      return () => {
        webSocketService.disconnect();
      };
    } else {
      setMessages([]);
    }
  }, [selectedGroup]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
        id:selectedGroup.id,
      sender: loggedInUser.username,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    if (webSocketService.client.connected) {
        webSocketService.sendMessage('/app/group.sendMessage', message);
        setNewMessage('');
      } else {
        console.error('WebSocket is not connected. Unable to send message.');
      }
  };

  if (!selectedGroup) {
    return (
      <div className="w-3/4 flex flex-col items-center justify-center bg-gray-100 h-full">
        <div className="p-4 bg-white border-b border-gray-300 flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <h2 className="text-lg font-semibold">Select a group to chat</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-3/4 flex flex-col bg-gray-100 h-full">
      {/* Chat header */}
      <div className="p-4 bg-white border-b border-gray-300 flex items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <h2 className="text-lg font-semibold">{selectedGroup.name}</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
  {messages.map((message, index) => (
    <div
      key={index}
      className={`mb-4 flex ${message.sender === loggedInUser.username ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`rounded-lg shadow-md max-w-full ${
          message.sender === loggedInUser.username
            ? 'bg-blue-400 text-white mr-auto'
            : 'bg-gray-200 text-gray-800'
        } p-3`}
      >
        <p className="text-sm font-semibold">
          {message.sender === loggedInUser.username ? 'You' : message.sender}
        </p>
        <p className="text-sm font-semibold">{message.content}</p>
        <p className="text-xs text-gray-500 mt-1 font-semibold">
          {formatTimestamp(message.timestamp)}
        </p>
      </div>
    </div>
  ))}
</div>


      {/* Message input section */}
      <div className="p-4 bg-white border-t border-gray-300 flex items-center">
        <input
          type="text"
          className="flex-1 border border-gray-300 p-3 rounded-l-lg outline-none"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 p-3 rounded-r-lg text-white flex items-center justify-center hover:bg-blue-400 transition-colors duration-200"
          onClick={handleSendMessage}
        >
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatGroupWindow;
