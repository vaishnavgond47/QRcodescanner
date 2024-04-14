import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useToast } from '../Context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {



    const Navigate = useNavigate  ();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const showToast = useToast();
  const API_URL = process.env.REACT_APP_BACKEND_URL;
 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        Navigate('/')
    }
},[Navigate])

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        name,
        email,
        password,
      });
      if(response){
        showToast('Signup Successful', 'success');
        setName('')
        setEmail('')
        setPassword('')

      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        showToast('Email already exists', 'error');
      } else {
        showToast('Signup failed', 'error');
      }
    }
  };

  return (
    <div className="bg-gray-300 min-h-screen flex items-center justify-center">
  <div className="flex w-full max-w-4xl mx-auto">
    {/* Left side - Image */}
    <div className="w-1/2 flex items-center justify-center">
      <img src="pranjal.webp" alt="Descriptive Alt Text" className="max-w-full h-auto rounded-lg" />
    </div>
    
    {/* Right side - Signup Form */}
    <div className="w-1/2 p-6 bg-gray-200 border border-gray-300 rounded-3xl shadow-lg" style={{marginLeft:"100px"}}>
      <h2 className="text-3xl font-semibold text-center mb-6">Signup</h2>
      <form onSubmit={handleSignup}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border bg-gray-100 rounded font-black shadow appearance-none"
            placeholder="Your name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border bg-gray-100 rounded font-black shadow appearance-none"
            placeholder="Your email"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded bg-gray-100 shadow font-black appearance-none"
            placeholder="Your password"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-500"
        >
          Signup
        </button>
        <div className='text-center py-3'>Already a Member? <Link to={'/login'} className='text-blue-600'>Log In</Link></div>
      </form>
    </div>
  </div>
  <ToastContainer
    position="top-right"
    autoClose={1000}
    limit={1}
    hideProgressBar={false}
    closeOnClick
    pauseOnHover
  />
</div>

  );
}

export default Signup;
