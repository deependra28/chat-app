import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      setSuccessMessage('Registration successful');
      setError(null);

      navigate('/home');
    } catch (error) {
      setError('There was a problem with the registration');
      setSuccessMessage('');
      console.error('There was a problem with the registration:', error.message);
    }
  };

  return (
    <div  style={{ 
      backgroundImage: `url('./bgimage.jpg')`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
     <div className="w-full max-w-xl mx-auto p-8 bg-white bg-opacity-90 rounded-md shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            className="border rounded-md px-4 py-2 w-full" 
            required 
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            className="border rounded-md px-4 py-2 w-full" 
            required 
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            className="border rounded-md px-4 py-2 w-full" 
            required 
          />
        </div>
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            name="confirmPassword" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            className="border rounded-md px-4 py-2 w-full" 
            required 
          />
        </div>
        <button 
          type="submit" 
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Register
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {successMessage && <div className="text-green-500 mt-2">{successMessage}</div>}
      </form>
    </div>
    </div>
  );
};

export default RegistrationForm;
