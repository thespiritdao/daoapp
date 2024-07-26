const express = require('express');
const router = express.Router();
const { Post, Comment } = require('../models/forum');
const auth = require('../middleware/auth');

// Create a new post
router.post('/posts', auth, async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      author: req.user._id
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all posts (with optional filtering)
router.get('/posts', async (req, res) => {
  try {
    const { category, tags, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const posts = await Post.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific post
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate('comments.author', 'username');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a post
router.patch('/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not have permission to update this post' });
    }

    Object.assign(post, req.body);
    post.updatedAt = Date.now();
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a post
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not have permission to delete this post' });
    }

    await post.remove();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a comment to a post
router.post('/posts/:id/comments', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      content: req.body.content,
      author: req.user._id
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a comment
router.patch('/posts/:postId/comments/:commentId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not have permission to update this comment' });
    }

    comment.content = req.body.content;
    comment.updatedAt = Date.now();
    await post.save();

    res.json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a comment
router.delete('/posts/:postId/comments/:commentId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not have permission to delete this comment' });
    }

    comment.remove();
    await post.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upvote a post
router.post('/posts/:id/upvote', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const upvoteIndex = post.upvotes.indexOf(req.user._id);
    const downvoteIndex = post.downvotes.indexOf(req.user._id);

    if (upvoteIndex === -1) {
      post.upvotes.push(req.user._id);
      if (downvoteIndex !== -1) {
        post.downvotes.splice(downvoteIndex, 1);
      }
    } else {
      post.upvotes.splice(upvoteIndex, 1);
    }

    await post.save();
    res.json({ upvotes: post.upvotes.length, downvotes: post.downvotes.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Downvote a post
router.post('/posts/:id/downvote', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const upvoteIndex = post.upvotes.indexOf(req.user._id);
    const downvoteIndex = post.downvotes.indexOf(req.user._id);

    if (downvoteIndex === -1) {
      post.downvotes.push(req.user._id);
      if (upvoteIndex !== -1) {
        post.upvotes.splice(upvoteIndex, 1);
      }
    } else {
      post.downvotes.splice(downvoteIndex, 1);
    }

    await post.save();
    res.json({ upvotes: post.upvotes.length, downvotes: post.downvotes.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;