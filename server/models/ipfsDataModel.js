const mongoose = require('mongoose');
const { Schema } = mongoose;

const ipfsDataSchema = Schema({
  cid: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('IPFSData', ipfsDataSchema);