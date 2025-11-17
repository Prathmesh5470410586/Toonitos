const express = require('express');
const router = express.Router();
const Show = require('../models/Show');

// public list + query
router.get('/', async (req, res) => {
  const shows = await Show.find().limit(50).lean();
  res.json(shows);
});

router.get('/:id', async (req, res) => {
  const show = await Show.findById(req.params.id).lean();
  if (!show) return res.status(404).json({ message: 'Not found' });
  res.json(show);
});

module.exports = router;
