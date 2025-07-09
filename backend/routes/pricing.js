const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// GET /api/pricing
router.get('/', (req, res) => {
  try {
    const pricingData = fs.readFileSync(path.join(__dirname, '../data/pricing.json'), 'utf8');
    const pricing = JSON.parse(pricingData);
    
    // Simulate loading delay
    setTimeout(() => {
      res.json(pricing);
    }, 400);
  } catch (error) {
    console.error('Error reading pricing data:', error);
    res.status(500).json({ error: 'Failed to load pricing' });
  }
});

module.exports = router;