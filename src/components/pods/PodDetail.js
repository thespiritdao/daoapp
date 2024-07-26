import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PodDetail = () => {
  const [pod, setPod] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPod = async () => {
      try {
        const response = await axios.get(`/api/pods/${id}`);
        setPod(response.data);
        setName(response.data.name);
        setDescription(response.data.description);
      } catch (error) {
        console.error('Error fetching pod:', error);
      }
    };

    fetchPod();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/pods/${id}`, { name, description });
      setIsEditing(false);
      setPod({ ...pod, name, description });
    } catch (error) {
      console.error('Error updating pod:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this pod?')) {
      try {
        await axios.delete(`/api/pods/${id}`);
        navigate('/pods');
      } catch (error) {
        console.error('Error deleting pod:', error);
      }
    }
  };

  if (!pod) return <div>Loading...</div>;

  return (
    <div>
      <h2>Pod Details</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <h3>{pod.name}</h3>
          <p>{pod.description}</p>
          <p>Creator: {pod.creatorId}</p>
          <p>Hat ID: {pod.hatId}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  );
};

export default PodDetail;