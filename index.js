require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
const userRoutes = require('./routes/userRoutes');
const artifactRoutes = require('./routes/artifactRoutes');
const podRoutes = require('./routes/podRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const recognitionRoutes = require('./routes/recognitionRoutes');
const eventRoutes = require('./routes/eventRoutes');
const resourceRoutes = require('./routes/resourceRoutes');

app.use('/api/users', userRoutes);
app.use('/api/artifacts', artifactRoutes);
app.use('/api/pods', podRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/recognitions', recognitionRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/resources', resourceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});