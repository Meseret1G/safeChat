import React, { useState, useEffect } from 'react';
import './Style.css';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import logo from "../icons/safe.png";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                setError("No JWT token found");
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/user/fetchUsers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ search: searchTerm }), // Send the search term
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            setError(error.message || "An unknown error occurred");
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [searchTerm]);

    return (
        <div className='list-container'>
            <div className='ug-header'>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logo} style={{ height: '40px', width: '40px', marginLeft: '10px' }} alt="Logo" />
                    <p className='ug-title' style={{ marginLeft: '10px' }}>Online Users</p>
                </div>
            </div>

            <div className='sidebar-search'>
                <IconButton onClick={fetchUsers}><SearchIcon /></IconButton>
                <input
                    placeholder='Search..'
                    className='search-box'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className='ug-content'>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <ul>
                        {users.map((user) => (
                            <li key={user._id}>{user.name} - {user.email}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Users;