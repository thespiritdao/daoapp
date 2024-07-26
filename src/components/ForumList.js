import React from 'react';
import { mockForumPosts } from '../mockData';

const ForumList = ({ limit }) => {
  const forumPosts = limit ? mockForumPosts.slice(0, limit) : mockForumPosts;

  return (
    <div className="forum-list">
      {forumPosts.map((post) => (
        <div key={post.id} className="forum-item">
          <h3>{post.title}</h3>
          <p>Author: {post.author}</p>
          <p>Replies: {post.replies}</p>
        </div>
      ))}
    </div>
  );
};

export default ForumList;