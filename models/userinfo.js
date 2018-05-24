const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserInfoSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  phone: {
    type: String,
  },
  country: {
    type: String,
  }
});

const UserInfo = mongoose.model('UserInfo', UserInfoSchema);

module.exports = UserInfo;
