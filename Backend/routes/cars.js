const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Car = require('../models/Car');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage, limits: { files: 10 } });

// @route   POST /api/cars
// @desc    Create a new car
// @access  Private
router.post('/', auth, upload.array('images', 10),async (req, res) => {
  const { title, description, tags } = req.body;
  const images = req.files.map(file => file.filename);

  try {
    const newCar = new Car({
      user: req.user.id,
      title,
      description,
      tags: tags.split(',').map(tag => tag.trim()),
      images
    });

    const car = await newCar.save();
    res.json(car);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/cars
// @desc    Get all cars of the logged-in user with search
// @access  Private
router.get('/', auth, async (req, res) => {
  const { search } = req.query;
  let query = { user: req.user.id };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const cars = await Car.find(query).sort({ createdAt: -1 });
    // console.log("Cars backend", cars);
    res.json({cars});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/cars/:id
// @desc    Get car by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ msg: 'Car not found' });
    }

    if (car.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    // console.log(car);
    const images = car.images;
    res.json({car, images});
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Car not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/cars/:id
// @desc    Update a car
// @access  Private
router.put('/:id', auth, upload.array('images', 10),async (req, res) => {
  const { title, description, tags } = req.body;
  const images = req.files.map(file => file.filename);

  // Build car object
  const carFields = {};
  if (title) carFields.title = title;
  if (description) carFields.description = description;
  if (tags) carFields.tags = tags.split(',').map(tag => tag.trim());
  if (images.length > 0) carFields.images = images;

  try {
    let car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ msg: 'Car not found' });
    }

    if (car.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    car = await Car.findByIdAndUpdate(
      req.params.id,
      { $set: carFields },
      { new: true }
    );

    res.json({car});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }

});

// @route   DELETE /api/cars/:id
// @desc    Delete a car
// @access  Private
router.delete('/:id', auth, upload.array('images', 10),async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ msg: 'Car not found' });
    }

    if (car.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await car.deleteOne();
    res.json({ msg: 'Car removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error'); 
  }

});

module.exports = router;
