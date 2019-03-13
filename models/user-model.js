const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  game: {type: Schema.Types.ObjectId, ref: 'Game'},
  bio: String,
  friends: {type: Schema.Types.ObjectId, ref: 'User'},
  wins: Number,
  losses: Number
}, 
{
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;