const mongoose = require('mongoose');
// eslint-disable-next-line import/no-unresolved
require('../schema/trainData');

const Train = mongoose.model('train');

const getTrainById = async(id) => {
  try {
    const train = await Train.findById(id);
    if (!train) {
      return { status: 'Train Not Found', customErrorCode: 11 };
    }
    return { status: 'Success', data: train };
  } catch (e) {
    return { status: e };
  }
};

const getAllTrains = async() => {
  try {
    const trains = await Train.find();
    if (trains.length === 0) {
      return { status: 'Trains Not Found', customErrorCode: 11 };
    }
    return { status: 'Success', data: trains };
  } catch (e) {
    return { status: e };
  }
};

const addTrain = async(train) => {
  try {
    const response = await Train.create(train);
    if (response._id) {
      return { status: 'Success', response };
    }
  } catch (e) {
    return { status: e };
  }
};

const updateTrain = async(id, train) => {
  try {
    const filter = { _id: id };
    const updateDocument = {
      $set: {
        name: train.name,
        reserved: train.reserved,
        available: train.available,
        time: train.time
      }
    };
    await Train.updateOne(filter, updateDocument);

    return { status: 'Successfully updated!' };
  } catch (e) {
    return { status: e };
  }
};

module.exports = {
  getTrainById,
  getAllTrains,
  addTrain,
  updateTrain
};
