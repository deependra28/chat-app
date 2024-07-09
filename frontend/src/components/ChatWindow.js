import React, { useState, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import webSocketService from './WebSocketService'; // Adjust the import path as needed

const ChatWindow = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const formatTimestamp = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString(); // Adjust formatting as needed
  };

  useEffect(() => {
    const handleReceivedMessage = (message) => {
      message.timestamp = parseInt(message.timestamp);
      setMessages((prevMessages) => [...prevMessages, message].sort((a, b) => a.timestamp - b.timestamp));
              message.timestamp = formatTimestamp(message.timestamp); // Format each timestamp

    };

    if (selectedUser) {
      fetchMessages();

      webSocketService.connect(handleReceivedMessage);

      return () => {
        webSocketService.disconnect();
      };
    } else {
      setMessages([]);
    }
  }, [selectedUser]);

  const fetchMessages = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('user'));

      const [senderResponse, receiverResponse] = await Promise.all([
        fetch(`http://localhost:8080/api/messages?sender=${loggedInUser.email}&receiver=${selectedUser.username}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
        fetch(`http://localhost:8080/api/receiver?sender=${selectedUser.username}&receiver=${loggedInUser.email}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      ]);

      if (!senderResponse.ok || !receiverResponse.ok) {
        throw new Error('Failed to fetch messages');
      }

      const [senderData, receiverData] = await Promise.all([
        senderResponse.json(),
        receiverResponse.json(),
      ]);

      const combinedData = [...senderData, ...receiverData];
      combinedData.forEach(message => {
        message.timestamp = parseInt(message.timestamp);
      });

      setMessages(combinedData.sort((a, b) => a.timestamp - b.timestamp));
      combinedData.forEach(message => {
        message.timestamp = formatTimestamp(message.timestamp); // Format each timestamp
      });
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    }
  };

  const handleSendMessage = () => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const message = {
      sender: loggedInUser.email,
      receiver: selectedUser.username,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    console.log('Sending message:', message); 

    if (webSocketService.client.connected) {
      webSocketService.sendMessage('/app/chat.sendMessage', message);
      setNewMessage('');
    } else {
      console.error('WebSocket is not connected. Unable to send message.');
    }
  };

  if (!selectedUser) {
    return (
      <div className="w-3/4 flex flex-col items-center justify-center bg-gray-100 h-full">
        <div className="p-4 bg-white border-b border-gray-300 flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <h2 className="text-lg font-semibold">Select a friend to chat</h2>
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
          <h2 className="text-lg font-semibold">{selectedUser.username}</h2>
        </div>
      </div>

      {/* Messages section */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${message.sender === selectedUser.username ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`rounded-lg shadow-md max-w-full ${
                message.sender === selectedUser.username
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-blue-400 text-white ml-auto'
              } p-3`}
            >
              <p className="text-sm font-semibold">{message.content}</p>
              <p className="text-xs text-gray-600 font-semibold mt-1">
                {(message.timestamp)}
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

export default ChatWindow;
