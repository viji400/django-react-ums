import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const UserList = () => {
    // --- Original State ---
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- New State for Features ---
    // State for the search bar
    const [searchTerm, setSearchTerm] = useState('');
    // State for the filter dropdown
    const [filterTitle, setFilterTitle] = useState('');
    // State for sorting config (key = column, direction = asc/desc)
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

    // --- Original Data Fetching (Unchanged) ---
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/users/');
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch users. Is the backend server running?');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // --- New: Get Unique Titles for Filter Dropdown ---
    const uniqueTitles = useMemo(() => {
        // Create a Set (which only holds unique values) of all titles
        return [...new Set(users.map(user => user.title))];
    }, [users]); // This runs only when the 'users' list changes

    // --- New: Filtering and Sorting Logic ---
    // useMemo ensures this logic only re-runs if its dependencies change
    const filteredAndSortedUsers = useMemo(() => {
        let sortedUsers = [...users]; // Start with the full user list

        // 1. FILTERING (Search + Dropdown)
        sortedUsers = sortedUsers.filter(user => {
            // Search term logic (case-insensitive)
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Filter title logic (skips if 'filterTitle' is empty)
            const matchesTitle = filterTitle ? user.title === filterTitle : true;
            
            return matchesSearch && matchesTitle;
        });

        // 2. SORTING
        if (sortConfig.key !== null) {
            sortedUsers.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortedUsers;

    }, [users, searchTerm, filterTitle, sortConfig]); // Re-calculate when any of these change

    // --- New: Sorting Click Handler ---
    const requestSort = (key) => {
        let direction = 'ascending';
        // If clicking the same column, toggle direction
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // --- New: Helper for Sort Icons ---
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return '↕'; // Not sorted
        if (sortConfig.direction === 'ascending') return '↑'; // Asc
        return '↓'; // Desc
    };

    // --- Original Render (with updates) ---
    if (loading) {
        return <p>Loading users...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="user-list">
            <h2>User Directory</h2>

            {/* --- New: Search and Filter Controls --- */}
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="filter-select"
                    value={filterTitle}
                    onChange={(e) => setFilterTitle(e.target.value)}
                >
                    <option value="">All Titles</option>
                    {uniqueTitles.map(title => (
                        <option key={title} value={title}>{title}</option>
                    ))}
                </select>
            </div>

            <table>
                <thead>
                    <tr>
                        {/* --- Updated: Headers are now sortable --- */}
                        <th onClick={() => requestSort('name')}>
                            Name {getSortIcon('name')}
                        </th>
                        <th onClick={() => requestSort('user_id')}>
                            User ID {getSortIcon('user_id')}
                        </th>
                        <th onClick={() => requestSort('title')}>
                            Title {getSortIcon('title')}
                        </th>
                        <th onClick={() => requestSort('email')}>
                            Email {getSortIcon('email')}
                        </th>
                        <th onClick={() => requestSort('manager_name')}>
                            Manager {getSortIcon('manager_name')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {/* --- Updated: Map over the new derived list --- */}
                    {filteredAndSortedUsers.map(user => (
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