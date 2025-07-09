const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// GET /api/slides
router.get('/', (req, res) => {
  try {
    const slidesData = fs.readFileSync(path.join(__dirname, '../data/slides.json'), 'utf8');
    const slides = JSON.parse(slidesData);
    
    // Simulate loading delay
    setTimeout(() => {
      res.json(slides);
    }, 500);
  } catch (error) {
    console.error('Error reading slides data:', error);
    res.status(500).json({ error: 'Failed to load slides' });
  }
});

module.exports = router;