const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const posterSchema = Schema({
    imageUrl: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Poster', posterSchema);