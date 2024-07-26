import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, TextField, CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('/api/members');
      setMembers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching members:', error);
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const response = await axios.get(`/api/members/search?query=${query}`);
        setMembers(response.data);
      } catch (error) {
        console.error('Error searching members:', error);
      }
    } else if (query.length === 0) {
      fetchMembers();
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <TextField
        label="Search members"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearch}
      />
      <List>
        {members.map((member) => (
          <ListItem key={member._id} button component={Link} to={`/members/${member._id}`}>
            <ListItemText primary={member.username} secondary={member.email} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default MemberList;