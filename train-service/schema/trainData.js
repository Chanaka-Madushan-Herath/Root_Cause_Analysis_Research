const mongoose = require('mongoose');

const TrainDataSchema = new mongoose.Schema(
  {
    name: String,
    reserved: Number,
    available: Number,
    time: String
  },
  {
    // collation: "UserInfo"
    collation: { locale: 'en_US', strength: 1 }
  }
);

mongoose.model('train', TrainDataSchema);
