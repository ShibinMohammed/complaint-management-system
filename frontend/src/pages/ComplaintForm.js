import React, { useState } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

function ComplaintForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Product',
    priority: 'Low',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsSuccess(false);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/complaints`, formData);
      setMessage('Complaint submitted successfully!');
      setIsSuccess(true);
      setFormData({
        title: '',
        description: '',
        category: 'Product',
        priority: 'Low',
      });
      console.log(response.data);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
      setIsSuccess(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Submit a Complaint</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Complaint Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Product">Product</option>
            <option value="Service">Service</option>
            <option value="Support">Support</option>
          </select>
        </div>
        <div className="form-group">
          <label>Priority:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="priority"
                value="Low"
                checked={formData.priority === 'Low'}
                onChange={handleChange}
              />
              Low
            </label>
            <label>
              <input
                type="radio"
                name="priority"
                value="Medium"
                checked={formData.priority === 'Medium'}
                onChange={handleChange}
              />
              Medium
            </label>
            <label>
              <input
                type="radio"
                name="priority"
                value="High"
                checked={formData.priority === 'High'}
                onChange={handleChange}
              />
              High
            </label>
          </div>
        </div>
        <div className="form-button-group">
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Submitting...' : <><FaPaperPlane /> Submit Complaint</>}
          </button>
        </div>
      </form>
      {message && (
        <p className={`message ${isSuccess ? 'success' : 'error'}`}>
          {isSuccess ? <FaCheckCircle /> : <FaExclamationCircle />}
          {message}
        </p>
      )}
    </div>
  );
}

export default ComplaintForm;