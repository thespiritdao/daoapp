import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Avatar, Grid, CircularProgress } from '@material-ui/core';

const MemberProfile = () => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(`/api/members/${id}`);
        setMember(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching member:', error);
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!member) {
    return <Typography variant="h6">Member not found</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar alt={member.username} src={member.avatar} style={{ width: 100, height: 100 }} />
          </Grid>
          <Grid item>
            <Typography variant="h4">{member.username}</Typography>
            <Typography variant="subtitle1">{member.email}</Typography>
          </Grid>
        </Grid>
        <Typography variant="h6" style={{ marginTop: 20 }}>Bio</Typography>
        <Typography variant="body1">{member.bio || 'No bio available'}</Typography>
        <Typography variant="h6" style={{ marginTop: 20 }}>Joined</Typography>
        <Typography variant="body1">{new Date(member.createdAt).toLocaleDateString()}</Typography>
        {/* Add more member details as needed */}
      </CardContent>
    </Card>
  );
};

export default MemberProfile;