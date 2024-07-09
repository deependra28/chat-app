import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, message, List } from 'antd';
import { UsergroupAddOutlined, PlusOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;

const Sidebar = ({ handleSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [friendRequestUsername, setFriendRequestUsername] = useState('');
  const [isFriendRequestModalVisible, setIsFriendRequestModalVisible] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [isIncomingRequestModalVisible, setIsIncomingRequestModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        const response = await fetch(`http://localhost:8080/api/users/all?id=${loggedInUser.id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch users');
        setLoading(false);
        console.error('Error fetching users:', error.message);
      }
    };

    const fetchIncomingRequests = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        const response = await fetch(`http://localhost:8080/api/friendships/pending?email=${loggedInUser.email}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch incoming requests');
        }

        const data = await response.json();
        console.log(data);
        setIncomingRequests(data);
      } catch (error) {
        console.error('Error fetching incoming requests:', error.message);
      }
    };

    fetchUsers();
    fetchIncomingRequests();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (user) => {
    handleSelectUser(user);
  };

  const showGroupModal = () => {
    setIsGroupModalVisible(true);
  };

  const handleGroupOk = async () => {
    const groupData = {
      groupData: {
        name: groupName
      },
      groupUsersData: selectedGroupMembers.map(username => username)
    };

    try {
      const response = await fetch('http://localhost:8080/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      });

      if (!response.ok) {
        throw new Error('Failed to create group');
      }
      const data = await response.json();
      message.success('Group created successfully!');
      setGroupName('');
      setSelectedGroupMembers([]);
      setIsGroupModalVisible(false);
    } catch (error) {
      console.error('Error creating group:', error.message);
      message.error('Failed to create group');
    }
  };

  const handleGroupCancel = () => {
    setIsGroupModalVisible(false);
  };

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const handleGroupMembersChange = (value) => {
    setSelectedGroupMembers(value);
  };

  const showFriendRequestModal = () => {
    setIsFriendRequestModalVisible(true);
  };

  const handleFriendRequestOk = async () => {
    setSendingRequest(true);
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`http://localhost:8080/api/friendships/send?id=${loggedInUser.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: friendRequestUsername }),
      });

      if (!response.ok) {
        throw new Error('Failed to send request');
      }
      const data = await response.json();
      message.success('Request sent successfully!');
      setFriendRequestUsername('');
      setIsFriendRequestModalVisible(false);
    } catch (error) {
      console.error('Error sending request:', error.message);
      message.error('Failed to send request');
    } finally {
      setSendingRequest(false);
    }
  };

  const handleFriendRequestCancel = () => {
    setIsFriendRequestModalVisible(false);
  };

  const handleIncomingRequestOk = async (id, action,username) => {
    console.log(id);
   
    try {
      const response = await fetch(`http://localhost:8080/api/friendships/status?action=${action}`, {
                method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
    }

    const data = await response.text();
    message.success(data);
      // message.success(`Request ${action}ed successfully!`);
      // setIncomingRequests(prevRequests => prevRequests.filter(req => req.username !== username));
    } catch (error) {
      console.error(`Error ${action}ing request:`, error.message);
      message.error(`Failed to ${action} request`);
    }
  };

  const showIncomingRequestModal = () => {
    setIsIncomingRequestModalVisible(true);
  };

  const handleIncomingRequestCancel = () => {
    setIsIncomingRequestModalVisible(false);
  };

  if (loading) {
    return <div className="w-1/4 bg-gray-900 text-white flex flex-col p-4">Loading...</div>;
  }

  if (error) {
    return <div className="w-1/4 bg-gray-900 text-white flex flex-col p-4">{error}</div>;
  }

  return (
    <div className="w-full sm:w-1/3 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700 flex flex-col sm:flex-row items-center justify-between">
        <h2 className="text-lg font-semibold mb-4 sm:mb-0">Chats</h2>
        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          <Button type="primary" icon={<UsergroupAddOutlined />} onClick={() => navigate("/group")}>
            View Groups
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={showGroupModal}>
            Create Group
          </Button>
          <Button type="primary" icon={<BellOutlined />} onClick={showIncomingRequestModal}>
            Requests ({incomingRequests.length})
          </Button>
        </div>
      </div>
      <div className="p-4 border-b border-gray-700 flex flex-col sm:flex-row items-center justify-between">
        <input
          type="text"
          className="bg-gray-800 text-white rounded px-3 py-2 outline-none mb-4 sm:mb-0 w-full sm:w-48 md:w-56"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button type="primary" onClick={showFriendRequestModal}>
          Send Request
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map(user => (
          <div key={user.id} className="p-4 hover:bg-gray-800 cursor-pointer border-b border-gray-700" onClick={() => handleUserClick(user)}>
            <h3 className="text-sm font-medium">{user.username}</h3>
            <p className="text-xs text-gray-400">Last message placeholder</p>
          </div>
        ))}
      </div>

      <Modal
        title="Create Group"
        visible={isGroupModalVisible}
        onOk={handleGroupOk}
        onCancel={handleGroupCancel}
      >
        <Input
          placeholder="Group Name"
          value={groupName}
          onChange={handleGroupNameChange}
        />
        <Select
          mode="multiple"
          placeholder="Select group members"
          value={selectedGroupMembers}
          onChange={handleGroupMembersChange}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {users.map(user => (
            <Option key={user.id} value={user.username}>
              {user.username}
            </Option>
          ))}
        </Select>
      </Modal>

      <Modal
        title="Send Friend Request"
        visible={isFriendRequestModalVisible}
        onOk={handleFriendRequestOk}
        onCancel={handleFriendRequestCancel}
        confirmLoading={sendingRequest}
      >
        <Input
          placeholder="Enter username"
          value={friendRequestUsername}
          onChange={(e) => setFriendRequestUsername(e.target.value)}
        />
      </Modal>

      <Modal
        title="Incoming Friend Requests"
        visible={isIncomingRequestModalVisible}
        onCancel={handleIncomingRequestCancel}
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={incomingRequests}
          renderItem={request => (
            <List.Item
              actions={[
                <Button type="primary" onClick={() => handleIncomingRequestOk(incomingRequests[0].id, 'accept')}>
                  Accept
                </Button>,
                <Button type="danger" onClick={() => handleIncomingRequestOk(incomingRequests[0].id, 'reject')}>
                  Reject
                </Button>,
              ]}
            >
            <List.Item.Meta
  title={<span className=' text-xl'><strong>{request.friend.username}</strong></span>}
  description=" "
/>
            </List.Item>
          )}
          
        />
      </Modal>
    </div>
  );
};

export default Sidebar;
