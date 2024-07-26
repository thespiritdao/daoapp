import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Grid, Typography, MenuItem, Chip, Box } from '@material-ui/core';

const ForumForm = () => {
  const [post, setPost] = useState({
    title: '',
    content: '',
    category: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/api/forum/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleTagAdd = () => {
    if (newTag && !post.tags.includes(newTag)) {
      setPost({ ...post, tags: [...post.tags, newTag] });
      setNewTag('');
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setPost({
      ...post,
      tags: post.tags.filter((tag) => tag !== tagToDelete),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.patch(`/api/forum/posts/${id}`, post);
      } else {
        await axios.post('/api/forum/posts', post);
      }
      navigate('/forum');
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Post' : 'Create New Post'}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Content"
            name="content"
            value={post.content}
            onChange={handleChange}
            multiline
            rows={6}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Category"
            name="category"
            value={post.category}
            onChange={handleChange}
            required
          >
            <MenuItem value="General">General</MenuItem>
            <MenuItem value="Announcements">Announcements</MenuItem>
            <MenuItem value="Technical">Technical</MenuItem>
            <MenuItem value="Governance">Governance</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
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
            {post.tags.map((tag) => (
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
            {id ? 'Update Post' : 'Create Post'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ForumForm;