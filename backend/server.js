const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// API routes
app.get('/api/slides', (req, res) => {
  // Sample slides data
  const slides = [
    {
      id: 1,
      title: 'Welcome to Our Platform',
      subtitle: 'Transform your business with our innovative solutions',
      cta: 'Get Started',
      backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80'
    },
    {
      id: 2,
      title: 'Powerful Features',
      subtitle: 'Everything you need to scale your business efficiently',
      cta: 'Learn More',
      backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2125&q=80'
    },
    {
      id: 3,
      title: 'Join Thousands of Users',
      subtitle: 'Trusted by companies worldwide for their success',
      cta: 'Start Free Trial',
      backgroundImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    }
  ];
  
  res.json(slides);
});

// Example of properly formatted route with parameters
app.get('/api/slides/:id', (req, res) => {
  const slideId = parseInt(req.params.id);
  // Handle slide by ID logic here
  res.json({ id: slideId, message: `Slide ${slideId} details` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

module.exports = app;