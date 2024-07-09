import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select } from 'antd';
import { UsergroupAddOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const ChatGroupSidebar = ({ handleSelectGroup }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:8080/groups', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }

        const data = await response.json();
        setGroups(data);
        console.log(groups);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch groups');
        setLoading(false);
        console.error('Error fetching groups:', error.message);
      }
    };

    fetchGroups();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGroupClick = (group) => {
    handleSelectGroup(group);
  };

  const showGroupModal = () => {
    setIsGroupModalVisible(true);
  };

  const handleGroupOk = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const newGroup = {
      name: groupName,
      members: selectedGroupMembers,
      createdBy: loggedInUser.username,
    };

    try {
      const response = await fetch('http://localhost:8080/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGroup),
      });

      if (!response.ok) {
        throw new Error('Failed to create group');
      }

      const createdGroup = await response.json();
      setGroups([...groups, createdGroup]);
      setGroupName('');
      setSelectedGroupMembers([]);
      setIsGroupModalVisible(false);
    } catch (error) {
      console.error('Error creating group:', error.message);
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

  if (loading) {
    return <div className="w-1/4 bg-gray-900 text-white flex flex-col p-4">Loading...</div>;
  }

  if (error) {
    return <div className="w-1/4 bg-gray-900 text-white flex flex-col p-4">{error}</div>;
  }

  return (
    <div className="w-1/3 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Groups</h2>
        <div className="flex items-center space-x-2">
        
         
        </div>
      </div>
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {/* <input
          type="text"
          className="bg-gray-800 text-white rounded px-3 py-2 outline-none w-40 sm:w-48 md:w-56"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={handleSearchChange}
        /> */}
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredGroups.map(group => (
          <div key={group.id} className="p-4 hover:bg-gray-800 cursor-pointer border-b border-gray-700" onClick={() => handleGroupClick(group)}>
            <h3 className="text-sm font-medium">{group.name}</h3>
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
          {/* {users.map(user => (
            <Option key={user.id} value={user.username}>
              {user.username}
            </Option>
          ))} */}
        </Select>
      </Modal>
    </div>
  );
};

export default ChatGroupSidebar;
