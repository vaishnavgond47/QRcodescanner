import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';


const Navbar = () => {
    const Navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn,name } = useAuth();
 

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        Navigate('/login');
    };



    return (
<nav className="bg-gray-800 p-4">
    <div className="container mx-auto">
        <div className="flex justify-between items-center">
            {/* Left side: Logo and Navigation Links */}
            <div className="flex items-center space-x-4">
                <Link to="/" className="flex items-center space-x-4  ">
                    <img src="./pranjal.jpg" alt="" className="w-12 h-12 rounded-full" />
                    <span className="text-3xl font-bold text-red-700">Scanner</span>
                </Link>
                {isLoggedIn && (
                    <div className="hidden md:flex space-x-4">
                        <Link to="/" className="text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium align-center">
                            Home
                        </Link>
                        <Link to="/history" className="text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium align-center">
                            History
                        </Link>
                    
                    </div>
                )}
            </div>

            {/* Right side: Conditional Links or User Info */}
            <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                    // Display user info and Logout when logged in
                    <>
                        <span className="text-white hidden md:block">{name} :</span>
                        <button
                            className="text-red-600 text-sm"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    // Display Login and Signup links when not logged in
                    <div className="flex space-x-6">
                        <div className="text-red-500 font-semibold hover:bg-gray-200 hover:text-black rounded-md px-3 py-2">
                            <Link to="/login">Login</Link>
                        </div>
                        <div className="text-red-500 font-semibold hover:bg-gray-200 hover:text-black rounded-md px-3 py-2">
                            <Link to="/signup">Signup</Link>
                        </div>
                    </div>
                )}
                <div className="md:hidden">
                    <button className="text-gray-600">
                        <i className="fas fa-bars"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</nav>


    );
};

export default Navbar;
