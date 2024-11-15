const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  tags: [String],
  images: [String], // Store image filenames or URLs
  // images: [
  //   {
  //     url: {
  //       type: String,
  //       required: true,
  //     },
  //     public_id: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  // ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Car', CarSchema);
