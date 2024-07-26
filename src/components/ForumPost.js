import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, TextField, Grid, Chip, List, ListItem, ListItemText, Divider } from '@material-ui/core';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

const ForumPost = () => {
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/api/forum/posts/${id}`);
      setPost(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post:', error);
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/forum/posts/${id}/comments`, { content: comment });
      setComment('');
      fetchPost();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleVote = async (voteType) => {
    try {
      const response = await axios.post(`/api/forum/posts/${id}/${voteType}`);
      setPost({ ...post, upvotes: response.data.upvotes, downvotes: response.data.downvotes });
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/api/forum/posts/${id}`);
        navigate('/forum');
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!post) {
    return <Typography>Post not found</Typography>;
  }

  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>{post.title}</Typography>
          <Typography variant="body1" paragraph>{post.content}</Typography>
          <Typography variant="subtitle1">
            Category: <Chip label={post.category} />
          </Typography>
          <Typography variant="subtitle1" style={{ marginTop: 10 }}>
            Tags: 
            {post.tags.map((tag, index) => (
              <Chip key={index} label={tag} style={{ marginLeft: 4 }} />
            ))}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Posted by {post.author.username} on {new Date(post.createdAt).toLocaleString()}
          </Typography>
          <Grid container spacing={2} style={{ marginTop: 20 }}>
            <Grid item>
              <Button
                startIcon={<ThumbUpIcon />}
                onClick={() => handleVote('upvote')}
              >
                Upvote ({post.upvotes.length})
              </Button>
            </Grid>
            <Grid item>
              <Button
                startIcon={<ThumbDownIcon />}
                onClick={() => handleVote('downvote')}
              >
                Downvote ({post.downvotes.length})
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="primary" onClick={() => navigate(`/forum/posts/edit/${id}`)}>
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

      <Typography variant="h5" style={{ marginTop: 20 }}>Comments</Typography>
      <List>
        {post.comments.map((comment) => (
          <React.Fragment key={comment._id}>
            <ListItem>
              <ListItemText
                primary={comment.content}
                secondary={`${comment.author.username} - ${new Date(comment.createdAt).toLocaleString()}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      <form onSubmit={handleCommentSubmit}>
        <TextField
          fullWidth
          label="Add a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Submit Comment
        </Button>
      </form>
    </div>
  );
};

export default ForumPost;