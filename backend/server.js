// server.js or app.js - Main server file
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
app.use(express.urlencoded({ extended: true }));

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// API routes
app.get('/api/slides', (req, res) => {
  try {
    const slides = [
      {
        id: 1,
        title: 'Welcome to SniperThink',
        subtitle: 'Transform your business with our innovative solutions',
        cta: 'Get Started',
        backgroundImage: 'https://images.unsplash.com/photo-1451187508271-5c5f5928 format&fit=crop&w=2072&q=80'
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
  } catch (error) {
    console.error('Error loading slides:', error);
    res.status(500).json({ error: 'Failed to load slides' });
  }
});

// Features endpoint
app.get('/api/features', (req, res) => {
  try {
    const features = [
      {
        id: 1,
        title: 'Easy to Use',
        description: 'Simple and intuitive interface for all users',
        icon: '🚀'
      },
      {
        id: 2,
        title: 'Secure',
        description: 'Enterprise-grade security for your data',
        icon: '🔒'
      },
      {
        id: 3,
        title: '24/7 Support',
        description: 'Round-the-clock support from our expert team',
        icon: '💬'
      },
      {
        id: 4,
        title: 'Fast Performance',
        description: 'Lightning-fast response times for all operations',
        icon: '⚡'
      },
      {
        id: 5,
        title: 'Cloud Integration',
        description: 'seamless integration with popular cloud platforms',
        icon: '☁️'
      },
      {
        id: 6,
        title: 'Analytics',
        description: 'Comprehensive analytics and reporting tools',
        icon: '📊'
      }
    ];
    
    res.json(features);
  } catch (error) {
    console.error('Error loading features:', error);
    res.status(500).json({ error: 'Failed to load features' });
  }
});

// Pricing endpoint
app.get('/api/pricing', (req, res) => {
  try {
    const pricing = [
      {
        id: 1,
        name: 'Basic',
        price: '$9/month',
        features: ['5 Projects', '1 User', 'Basic Support', '1GB Storage']
      },
      {
        id: 2,
        name: 'Pro',
        price: '$29/month',
        features: ['Unlimited Projects', '5 Users', 'Priority Support', '10GB Storage', 'Advanced Analytics']
      },
      {
        id: 3,
        name: 'Enterprise',
        price: 'Contact us',
        features: ['Unlimited Everything', 'Unlimited Users', 'Dedicated Support', 'Custom Storage', 'SLA Guarantee', 'Custom Integrations']
      }
    ];
    
    res.json(pricing);
  } catch (error) {
    console.error('Error loading pricing:', error);
    res.status(500).json({ error: 'Failed to load pricing' });
  }
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'All fields are required',
        fields: { name: !name, email: !email, message: !message }
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Please enter a valid email address',
        fields: { email: true }
      });
    }
    
    // Create contact entry
    const contactEntry = {
      id: Date.now(),
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
      status: 'new'
    };
    
    // Log to console
    console.log('New Contact Form Submission:');
    console.log('==========================');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    console.log(`Time: ${contactEntry.timestamp}`);
    console.log('==========================\n');
    
    // Save to file (optional)
    const contactsFile = path.join(__dirname, 'data/contacts.json');
    let contacts = [];
    
    try {
      if (fs.existsSync(contactsFile)) {
        const existingContacts = fs.readFileSync(contactsFile, 'utf8');
        contacts = JSON.parse(existingContacts);
      }
    } catch (error) {
      console.log('Creating new contacts file');
    }
    
    contacts.push(contactEntry);
    
    try {
      fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2));
    } catch (error) {
      console.error('Error saving contact:', error);
    }
    
    // Response
    res.json({ 
      success: true, 
      message: 'Thank you for your message! We\'ll get back to you soon.',
      id: contactEntry.id 
    });
    
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ error: 'Failed to process your message. Please try again.' });
  }
});

// Get contact by ID
app.get('/api/contact/:id', (req, res) => {
  try {
    const contactId = parseInt(req.params.id);
    const contactsFile = path.join(__dirname, 'data/contacts.json');
    
    if (!fs.existsSync(contactsFile)) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    const contacts = JSON.parse(fs.readFileSync(contactsFile, 'utf8'));
    const contact = contacts.find(c => c.id === contactId);
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    console.error('Error retrieving contact:', error);
    res.status(500).json({ error: 'Failed to retrieve contact' });
  }
});

// Get all contacts (for admin purposes)
app.get('/api/contacts', (req, res) => {
  try {
    const contactsFile = path.join(__dirname, 'data/contacts.json');
    
    if (!fs.existsSync(contactsFile)) {
      return res.json([]);
    }
    
    const contacts = JSON.parse(fs.readFileSync(contactsFile, 'utf8'));
    res.json(contacts);
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    res.status(500).json({ error: 'Failed to retrieve contacts' });
  }
});

// Example of properly formatted route with parameters
app.get('/api/slides/:id', (req, res) => {
  try {
    const slideId = parseInt(req.params.id);
    
    const slides = [
      {
        id: 1,
        title: 'Welcome to SniperThink',
        subtitle: 'Transform your business with our innovative solutions',
        cta: 'Get Started',
        backgroundImage: 'https://images.unsplash.com/photo-1451187508271-5c5f59289596?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80'
      },
      {
        id: 2,
        title: 'Powerful Features',
        subtitle: 'Everything you need to scale your business efficiently',
        cta: 'Learn More',
        backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVuuUZIZi1ıdFnb3mlSd}@ß¤-_YzZ4r3¤@qr1'
      },
      {
        id: 3,
        title: 'Join Thousands of Users',
        subtitle: 'Trusted by companies worldwide for their success',
        cta: 'Start Free Trial',
        backgroundImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      }
    ];
    
    const slide = slides.find(s => s.id === slideId);
    
    if (!slide) {
      return res.status(404).json({ error: 'Slide not found' });
    }
    
    res.json(slide);
  } catch (error) {
    console.error('Error retrieving slide:', error);
    res.status(500).json({ error: 'Failed to retrieve slide' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
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
  console.log(`🔗 Available endpoints:`);
  console.log(`   GET  /api/slides`);
  console.log(`   GET  /api/features`);
  console.log(`   GET  /api/pricing`);
  console.log(`   POST /api/contact`);
  console.log(`   GET  /api/contacts`);
  console.log(`   GET  /api/health`);
});

module.exports = app;