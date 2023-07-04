const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema(
  {
    trainId: String,
    userId: String
  },
  {
    // collation: "UserInfo"
    collation: { locale: 'en_US', strength: 1 }
  }
);

mongoose.model('reservation', UserDataSchema);
