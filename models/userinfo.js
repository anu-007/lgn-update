const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserInfoSchema = new Schema({
  phone: {
    type: Number,
  },
  country: {
    type: String,
  }
});

const UserInfo = mongoose.model('UserInfo', UserInfoSchema);

module.exports = UserInfo;
