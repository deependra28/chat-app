import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      
      setFormData({
        email: '',
        password: ''
      });

      setSuccessMessage('Login successful');
      setError(null);
     console.log(result);
      // Assuming the result contains user data and/or a token
      localStorage.setItem('user', JSON.stringify(result));
      localStorage.setItem('token', result.token);
      const loggedInUser = (localStorage.getItem('user'));
   

      navigate('/chat');
    } catch (error) {
      setError('There was a problem with the login');
      setSuccessMessage('');
      console.error('There was a problem with the login:', error.message);
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
     <h2 className="text-2xl font-bold mb-4">User Login</h2>
    <form onSubmit={handleSubmit}>
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
        <div className="mb-6">
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
        <button 
          type="submit" 
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Login
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {successMessage && <div className="text-green-500 mt-2">{successMessage}</div>}
      </form>
      <div className="mt-4">
        <p className="text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </div>
    </div>
    </div>
  );
};

export default LoginForm;
