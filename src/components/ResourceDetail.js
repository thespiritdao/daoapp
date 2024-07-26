import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Chip, Grid, CircularProgress } from '@material-ui/core';

const ResourceDetail = () => {
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      const response = await axios.get(`/api/resources/${id}`);
      setResource(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resource:', error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await axios.delete(`/api/resources/${id}`);
        navigate('/resources');
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!resource) {
    return <Typography variant="h6">Resource not found</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>{resource.title}</Typography>
        <Typography variant="body1" paragraph>{resource.description}</Typography>
        <Typography variant="subtitle1">
          Category: <Chip label={resource.category} />
        </Typography>
        <Typography variant="subtitle1" style={{ marginTop: 10 }}>
          Tags: 
          {resource.tags.map((tag, index) => (
            <Chip key={index} label={tag} style={{ marginLeft: 4 }} />
          ))}
        </Typography>
        <Typography variant="subtitle1" style={{ marginTop: 10 }}>
          Created by: {resource.createdBy.username}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          Created at: {new Date(resource.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          Last updated: {new Date(resource.updatedAt).toLocaleString()}
        </Typography>
        <Grid container spacing={2} style={{ marginTop: 20 }}>
          <Grid item>
            <Button variant="contained" color="primary" href={resource.url} target="_blank" rel="noopener noreferrer">
              View Resource
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="primary" onClick={() => navigate(`/resources/edit/${id}`)}>
              Edit
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="secondary" onClick={handleDelete}>
              Delete
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ResourceDetail;