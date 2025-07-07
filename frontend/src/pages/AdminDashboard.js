import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaSpinner, FaExclamationCircle, FaCheckCircle, FaHourglassHalf, FaPlayCircle, FaFilter } from 'react-icons/fa';
import './AdminDashboard.css';

function AdminDashboard() {
  // Added a comment to trigger Vercel redeployment

  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState(''); // State for status filter
  const [filterPriority, setFilterPriority] = useState(''); // State for priority filter

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchComplaints();
    } else if (user && !user.isAdmin) {
      setError('You do not have administrative access to view this page.');
      setLoading(false);
    } else {
      setError('Please log in to view this page.');
      setLoading(false);
    }
  }, [user, filterStatus, filterPriority]); // Re-fetch when filters change

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${process.env.REACT_APP_API_URL}/api/complaints`;
      const params = new URLSearchParams();

      if (filterStatus) {
        params.append('status', filterStatus);
      }
      if (filterPriority) {
        params.append('priority', filterPriority);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);
      setComplaints(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/complaints/${id}`, { status: newStatus });
      fetchComplaints(); // Refresh the list after update
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/complaints/${id}`);
        fetchComplaints(); // Refresh the list after update
      } catch (err) {
        console.error('Error deleting complaint:', err);
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'In Progress':
        return 'status-in-progress';
      case 'Resolved':
        return 'status-resolved';
      default:
        return '';
    }
  };

  if (loading) return <div className="loading-message"><FaSpinner className="spinner" /> Loading complaints...</div>;
  if (error) return <div className="error-message"><FaExclamationCircle /> Error: {error}</div>;

  return (
    <div className="admin-table-container">
      <h1>Admin Dashboard</h1>

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="statusFilter"><FaFilter /> Filter by Status:</label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priorityFilter"><FaFilter /> Filter by Priority:</label>
          <select
            id="priorityFilter"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {complaints.length === 0 ? (
        <p className="loading-message">No complaints to display with current filters.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Date Submitted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint._id}>
                <td>{complaint.title}</td>
                <td>{complaint.category}</td>
                <td>{complaint.priority}</td>
                <td>{new Date(complaint.dateSubmitted).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(complaint.status)}`}>
                    {complaint.status === 'Pending' && <FaHourglassHalf />}
                    {complaint.status === 'In Progress' && <FaPlayCircle />}
                    {complaint.status === 'Resolved' && <FaCheckCircle />}
                    {` ${complaint.status}`}
                  </span>
                </td>
                <td style={{ verticalAlign: 'top', paddingTop: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <select
                      value={complaint.status}
                      onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                      style={{ minWidth: '120px' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    <button onClick={() => handleDelete(complaint._id)} className="delete-button">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;