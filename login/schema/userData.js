const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema(
  {
    name: String,
    uName: String,
    password: String,
    email: { type: String, unique: true }
  },
  {
    // collation: "UserInfo"
    collation: { locale: 'en_US', strength: 1 }
  }
);

mongoose.model('userData', UserDataSchema);
