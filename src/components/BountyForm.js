import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Grid, Typography, MenuItem, Chip, Box } from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';

const BountyForm = () => {
  const [bounty, setBounty] = useState({
    title: '',
    description: '',
    reward: '',
    currency: '$SELF',
    deadline: new Date(),
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchBounty();
    }
  }, [id]);

  const fetchBounty = async () => {
    try {
      const response = await axios.get(`/api/bounties/${id}`);
      setBounty(response.data);
    } catch (error) {
      console.error('Error fetching bounty:', error);
    }
  };

  const handleChange = (e) => {
    setBounty({ ...bounty, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setBounty({ ...bounty, deadline: date });
  };

  const handleTagAdd = () => {
    if (newTag && !bounty.tags.includes(newTag)) {
      setBounty({ ...bounty, tags: [...bounty.tags, newTag] });
      setNewTag('');
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setBounty({
      ...bounty,
      tags: bounty.tags.filter((tag) => tag !== tagToDelete),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.patch(`/api/bounties/${id}`, bounty);
      } else {
        await axios.post('/api/bounties', bounty);
      }
      navigate('/bounties');
    } catch (error) {
      console.error('Error saving bounty:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Bounty' : 'Create New Bounty'}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={bounty.title}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={bounty.description}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Reward"
            name="reward"
            type="number"
            value={bounty.reward}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Currency"
            name="currency"
            value={bounty.currency}
            onChange={handleChange}
            required
          >
            <MenuItem value="$SELF">$SELF</MenuItem>
            <MenuItem value="ETH">ETH</MenuItem>
            <MenuItem value="USDC">USDC</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <DateTimePicker
            label="Deadline"
            value={bounty.deadline}
            onChange={handleDateChange}
            renderInput={(props) => <TextField {...props} fullWidth />}
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
            {bounty.tags.map((tag) => (
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
            {id ? 'Update Bounty' : 'Create Bounty'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default BountyForm;