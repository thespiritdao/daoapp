import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Grid, Typography, MenuItem, Chip, Box } from '@material-ui/core';

const ResourceForm = () => {
  const [resource, setResource] = useState({
    title: '',
    description: '',
    url: '',
    category: '',
    tags: [],
    requiredTokenId: ''
  });
  const [newTag, setNewTag] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchResource();
    }
  }, [id]);

  const fetchResource = async () => {
    try {
      const response = await axios.get(`/api/resources/${id}`);
      setResource(response.data);
    } catch (error) {
      console.error('Error fetching resource:', error);
    }
  };

  const handleChange = (e) => {
    setResource({ ...resource, [e.target.name]: e.target.value });
  };

  const handleTagAdd = () => {
    if (newTag && !resource.tags.includes(newTag)) {
      setResource({ ...resource, tags: [...resource.tags, newTag] });
      setNewTag('');
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setResource({
      ...resource,
      tags: resource.tags.filter((tag) => tag !== tagToDelete),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.patch(`/api/resources/${id}`, resource);
      } else {
        await axios.post('/api/resources', resource);
      }
      navigate('/resources');
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Resource' : 'Create New Resource'}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={resource.title}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={resource.description}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="URL"
            name="url"
            value={resource.url}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Category"
            name="category"
            value={resource.category}
            onChange={handleChange}
            required
          >
            <MenuItem value="Documentation">Documentation</MenuItem>
            <MenuItem value="Tutorial">Tutorial</MenuItem>
            <MenuItem value="Article">Article</MenuItem>
            <MenuItem value="Video">Video</MenuItem>
            <MenuItem value="Tool">Tool</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Required Token ID"
            name="requiredTokenId"
            value={resource.requiredTokenId}
            onChange={handleChange}
            helperText="Leave blank if no token gating is required"
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <TextField
              label="Add Tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <Button onClick={handleTagAdd} style={{ marginLeft: 10 }}>
              Add
            </Button>
          </Box>
          <Box marginTop={2}>
            {resource.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleTagDelete(tag)}
                style={{ margin: 4 }}
              />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            {id ? 'Update Resource' : 'Create Resource'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ResourceForm;