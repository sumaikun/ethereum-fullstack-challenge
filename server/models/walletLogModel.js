const mongoose = require('mongoose');
const { Schema } = mongoose;

const walletLogSchema = Schema({
  address: String,
  hash: String,
  from: String,
  to: String,
  value: String,
  timestamp: String,
  blockNumber: String,
}, { timestamps: true });

module.exports = mongoose.model('WalletLog', walletLogSchema);