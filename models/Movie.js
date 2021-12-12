const mongoose = require('mongoose')
const Schema = mongoose.Schema
const movieSchema = Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String },
    imageUrl: { type: String },
    isSeries: { type: String },
    ownerId: { type: String },
    comments: { type: Array },
    likes: { type: Array },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Movie', movieSchema)
