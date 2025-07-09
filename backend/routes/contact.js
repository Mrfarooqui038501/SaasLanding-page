const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// POST /api/contact
router.post('/', (req, res) => {
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
    
    // Log to console (in production, you'd save to database)
    console.log('New Contact Form Submission:');
    console.log('==========================');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    console.log(`Time: ${contactEntry.timestamp}`);
    console.log('==========================\n');
    
    // Optionally save to file (for demonstration)
    const contactsFile = path.join(__dirname, '../data/contacts.json');
    let contacts = [];
    
    try {
      if (fs.existsSync(contactsFile)) {
        const existingContacts = fs.readFileSync(contactsFile, 'utf8');
        contacts = JSON.parse(existingContacts);
      }
    } catch (error) {
      console.log('No existing contacts file, creating new one');
    }
    
    contacts.push(contactEntry);
    
    fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2));
    
    // Simulate processing delay
    setTimeout(() => {
      res.json({ 
        success: true, 
        message: 'Thank you for your message! We\'ll get back to you soon.',
        id: contactEntry.id 
      });
    }, 800);
    
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ error: 'Failed to process your message. Please try again.' });
  }
});

module.exports = router;