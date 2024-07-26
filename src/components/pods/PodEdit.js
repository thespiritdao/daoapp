import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PodEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pod, setPod] = useState({
    name: '',
    description: '',
    parentPodId: '',
    hatId: ''
  });

  useEffect(() => {
    const fetchPod = async () => {
      try {
        const response = await axios.get(`/api/pods/${id}`);
        setPod(response.data);
      } catch (error) {
        console.error('Error fetching pod:', error);
      }
    };
    fetchPod();
  }, [id]);

  const handleChange = (e) => {
    setPod({ ...pod, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/pods/${id}`, pod);
      navigate(`/pods/${id}`);
    } catch (error) {
      console.error('Error updating pod:', error);
    }
  };

  return (
    <div className="pod-edit">
      <h2>Edit Pod</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={pod.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={pod.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="parentPodId">Parent Pod ID:</label>
          <input
            type="text"
            id="parentPodId"
            name="parentPodId"
            value={pod.parentPodId}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="hatId">Hat ID:</label>
          <input
            type="text"
            id="hatId"
            name="hatId"
            value={pod.hatId}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Pod</button>
      </form>
    </div>
  );
};

export default PodEdit;