import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, TextField, Grid, Chip, List, ListItem, ListItemText, Divider } from '@material-ui/core';

const BountyDetail = () => {
  const [bounty, setBounty] = useState(null);
  const [submission, setSubmission] = useState('');
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBounty();
  }, [id]);

  const fetchBounty = async () => {
    try {
      const response = await axios.get(`/api/bounties/${id}`);
      setBounty(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bounty:', error);
      setLoading(false);
    }
  };

  const handleSubmissionSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/bounties/${id}/submissions`, { content: submission });
      setSubmission('');
      fetchBounty();
    } catch (error) {
      console.error('Error submitting work:', error);
    }
  };

  const handleReviewSubmission = async (submissionId, status) => {
    try {
      await axios.patch(`/api/bounties/${id}/submissions/${submissionId}`, { status });
      fetchBounty();
    } catch (error) {
      console.error('Error reviewing submission:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bounty?')) {
      try {
        await axios.delete(`/api/bounties/${id}`);
        navigate('/bounties');
      } catch (error) {
        console.error('Error deleting bounty:', error);
      }
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!bounty) {
    return <Typography>Bounty not found</Typography>;
  }

  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>{bounty.title}</Typography>
          <Typography variant="body1" paragraph>{bounty.description}</Typography>
          <Typography variant="h6">
            Reward: {bounty.reward} {bounty.currency}
          </Typography>
          <Typography variant="subtitle1">
            Status: <Chip label={bounty.status} />
          </Typography>
          <Typography variant="subtitle1" style={{ marginTop: 10 }}>
            Tags: 
            {bounty.tags.map((tag, index) => (
              <Chip key={index} label={tag} style={{ marginLeft: 4 }} />
            ))}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Created by: {bounty.creator.username}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Deadline: {new Date(bounty.deadline).toLocaleString()}
          </Typography>
          <Grid container spacing={2} style={{ marginTop: 20 }}>
            <Grid item>
              <Button variant="outlined" color="primary" onClick={() => navigate(`/bounties/edit/${id}`)}>
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

      <Typography variant="h5" style={{ marginTop: 20 }}>Submit Work</Typography>
      <form onSubmit={handleSubmissionSubmit}>
        <TextField
          fullWidth
          label="Your submission"
          value={submission}
          onChange={(e) => setSubmission(e.target.value)}
          multiline
          rows={4}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Submit Work
        </Button>
      </form>

      <Typography variant="h5" style={{ marginTop: 20 }}>Submissions</Typography>
      <List>
        {bounty.submissions.map((sub) => (
          <React.Fragment key={sub._id}>
            <ListItem>
              <ListItemText
                primary={sub.content}
                secondary={
                  <>
                    Submitted by {sub.submitter.username} on {new Date(sub.submittedAt).toLocaleString()}
                    <br />
                    Status: {sub.status}
                    {bounty.creator._id === /* Current user ID */ && sub.status === 'Pending' && (
                      <>
                        <Button onClick={() => handleReviewSubmission(sub._id, 'Accepted')}>Accept</Button>
                        <Button onClick={() => handleReviewSubmission(sub._id, 'Rejected')}>Reject</Button>
                      </>
                    )}
                  </>
                }
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default BountyDetail;