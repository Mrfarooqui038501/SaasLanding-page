const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// GET /api/features
router.get('/', (req, res) => {
  try {
    const featuresData = fs.readFileSync(path.join(__dirname, '../data/features.json'), 'utf8');
    const features = JSON.parse(featuresData);
    
    // Simulate loading delay
    setTimeout(() => {
      res.json(features);
    }, 300);
  } catch (error) {
    console.error('Error reading features data:', error);
    res.status(500).json({ error: 'Failed to load features' });
  }
});

module.exports = router;