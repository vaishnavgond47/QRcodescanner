import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useToast } from '../Context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

function Login() {
    const Navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const showToast = useToast();
  const { setIsLoggedIn } = useAuth();
  
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        Navigate('/')
    }else{
        Navigate('/login')
    }
},[Navigate])
  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);      
      showToast('Login Successful', 'success');
      setIsLoggedIn(true)
      Navigate('/')
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showToast('Incorrect email or password', 'error');
      } else {
        showToast('Login failed', 'error');
      }
    }
  };

  return (
    <div className="bg-gray-300 min-h-screen flex items-center justify-center">
    <div className="flex w-full max-w-4xl mx-auto">
        {/* Image container */}
        <div className="w-1/2 flex justify-center items-center">
            {/* Replace the src attribute with your desired image path */}
            <img src="./pranjal.webp" alt="A descriptive alt text" className="object-cover h-full" />
        </div>

        {/* Form container */}
        <div className="w-1/2 flex justify-center items-center ml-2" style={{marginLeft:"130px"}}>
            <div className="max-w-md w-full p-6 bg-gray-200 border border-gray-300 rounded-3xl shadow-lg">
                <h2 className="text-3xl font-semibold text-center mb-6">Login your Account</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border bg-gray-100 font-black rounded shadow appearance-none"
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
                            className="w-full p-3 border bg-gray-100 font-black rounded shadow appearance-none"
                            placeholder="Your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-500"
                    >
                        Login
                    </button>
                    <div className='text-center py-3'>Not a Member? <Link to={'/signup'} className='text-blue-600'>Sign Up</Link></div>
                </form>
            </div>
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

export default Login;
