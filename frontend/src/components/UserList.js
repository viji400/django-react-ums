import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // This function fetches the data from our Django API
        const fetchUsers = async () => {
            try {
                // Make sure your Django server is running on port 8000!
                const response = await axios.get('http://127.0.0.1:8000/api/users/');
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch users. Is the backend server running?');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []); // The empty array [] means this runs once when the component mounts

    if (loading) {
        return <p>Loading users...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="user-list">
            <h2>User Directory</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>User ID</th>
                        <th>Title</th>
                        <th>Email</th>
                        <th>Manager</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.user_id}>
                            <td>{user.name}</td>
                            <td>{user.user_id}</td>
                            <td>{user.title}</td>
                            <td>{user.email}</td>
                            <td>{user.manager_name || '—'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;