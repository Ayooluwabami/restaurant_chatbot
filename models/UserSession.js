const mongoose = require('mongoose');

const userSessionSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const UserSession = mongoose.model('UserSession', userSessionSchema);

module.exports = UserSession;
