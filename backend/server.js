const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Sample data
const slides = [
  {
    id: 1,
    title: 'Welcome to SniperThink',
    subtitle: 'Transform your business with our innovative solutions',
    cta: 'Get Started',
    backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=2072&q=80'
  },
  {
    id: 2,
    title: 'Powerful Features',
    subtitle: 'Everything you need to scale your business efficiently',
    cta: 'Learn More',
    backgroundImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=2125&q=80'
  },
  {
    id: 3,
    title: 'Join Thousands of Users',
    subtitle: 'Trusted by companies worldwide for their success',
    cta: 'Start Free Trial',
    backgroundImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=2070&q=80'
  }
];

const features = [
  { id: 1, title: 'Easy to Use', description: 'Simple and intuitive interface for all users', icon: '🚀' },
  { id: 2, title: 'Secure', description: 'Enterprise-grade security for your data', icon: '🔒' },
  { id: 3, title: '24/7 Support', description: 'Round-the-clock support from our expert team', icon: '💬' },
  { id: 4, title: 'Fast Performance', description: 'Lightning-fast response times for all operations', icon: '⚡' },
  { id: 5, title: 'Cloud Integration', description: 'Seamless integration with popular cloud platforms', icon: '☁️' },
  { id: 6, title: 'Analytics', description: 'Comprehensive analytics and reporting tools', icon: '📊' }
];

const pricing = [
  { id: 1, name: 'Basic', price: '$9/month', features: ['5 Projects', '1 User', 'Basic Support', '1GB Storage'] },
  { id: 2, name: 'Pro', price: '$29/month', features: ['Unlimited Projects', '5 Users', 'Priority Support', '10GB Storage', 'Advanced Analytics'] },
  { id: 3, name: 'Enterprise', price: 'Contact us', features: ['Unlimited Everything', 'Unlimited Users', 'Dedicated Support', 'Custom Storage', 'SLA Guarantee', 'Custom Integrations'] }
];

// Helper function to read/write contacts
const getContacts = () => {
  const contactsFile = path.join(__dirname, 'data/contacts.json');
  if (fs.existsSync(contactsFile)) {
    return JSON.parse(fs.readFileSync(contactsFile, 'utf8'));
  }
  return [];
};

const saveContacts = (contacts) => {
  const contactsFile = path.join(__dirname, 'data/contacts.json');
  fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2));
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

app.get('/api/slides', (req, res) => {
  res.json(slides);
});

app.get('/api/slides/:id', (req, res) => {
  const slide = slides.find(s => s.id === parseInt(req.params.id));
  if (!slide) return res.status(404).json({ error: 'Slide not found' });
  res.json(slide);
});

app.get('/api/features', (req, res) => {
  res.json(features);
});

app.get('/api/pricing', (req, res) => {
  res.json(pricing);
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }
  
  const contactEntry = {
    id: Date.now(),
    name,
    email,
    message,
    timestamp: new Date().toISOString(),
    status: 'new'
  };
  
  // Save contact
  try {
    const contacts = getContacts();
    contacts.push(contactEntry);
    saveContacts(contacts);
    
    console.log(`New contact: ${name} (${email})`);
    
    res.json({ 
      success: true, 
      message: 'Thank you for your message! We\'ll get back to you soon.',
      id: contactEntry.id 
    });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Failed to process your message. Please try again.' });
  }
});

app.get('/api/contacts', (req, res) => {
  res.json(getContacts());
});

app.get('/api/contact/:id', (req, res) => {
  const contact = getContacts().find(c => c.id === parseInt(req.params.id));
  if (!contact) return res.status(404).json({ error: 'Contact not found' });
  res.json(contact);
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

module.exports = app;