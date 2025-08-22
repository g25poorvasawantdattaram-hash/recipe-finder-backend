const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Recipe = require('../models/Recipe');
const mongoose = require('mongoose');

// MUST be before '/:id'
router.get('/mine', auth, async (req, res) => {
  const uid = req.user._id || req.user.id;
  const list = await Recipe.find({ user: uid }).sort('-createdAt').lean();
  res.json(list);
});

// list all (public)
router.get('/', async (_req, res) => {
  const items = await Recipe.find().sort('-createdAt').lean();
  res.json(items);
});

// get one by id (no regex; validate inside)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid recipe id' });
  }
  const r = await Recipe.findById(id);
  if (!r) return res.status(404).json({ message: 'Not found' });
  res.json(r);
});

// create (protected)
router.post('/', auth, async (req, res) => {
  try {
    const uid = req.user._id || req.user.id;
    const created = await Recipe.create({ ...req.body, user: uid });
    res.status(201).json(created);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// update (protected)
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid recipe id' });
  }
  try {
    const updated = await Recipe.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// delete (protected)
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid recipe id' });
  }
  const del = await Recipe.findByIdAndDelete(id);
  if (!del) return res.status(404).json({ message: 'Not found' });
  res.json({ deleted: true });
});

module.exports = router;
