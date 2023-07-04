const trainService = require('../services/trainService');
const constants = require('../utils/Constants');

const create = async(req, res, next) => {
  const {
    name,
    reserved,
    available,
    time
  } = req.body;

  const missingParam =
    (!name && 'train name') ||
    (!reserved && 'reserved count') ||
    (!available && 'available count') ||
    (!time && 'time');

  if (missingParam) {
    const message = `Bad Request: ${missingParam} param is required`;
    const error = new Error(message);
    error.statusCode = constants.ERROR_400;
    next(error);
  }
  const train = {
    name,
    reserved,
    available,
    time
  };
  try {
    const response = await trainService.addTrain(train);
    res.send({ response });
  } catch (error) {
    next(error);
  }
};
const update = async(req, res, next) => {
  const { id } = req.query;
  const {
    name,
    reserved,
    available,
    time
  } = req.body;

  const missingParam =
    (!id && 'train id') ||
    (!name && 'train name') ||
    (!reserved && 'reserved count') ||
    (!available && 'available count') ||
    (!time && 'time');

  if (missingParam) {
    const message = `Bad Request: ${missingParam} param is required`;
    const error = new Error(message);
    error.statusCode = constants.ERROR_400;
    next(error);
  }
  const train = {
    name,
    reserved,
    available,
    time
  };

  try {
    const response = await trainService.updateTrain(id, train);
    res.send({ response });
  } catch (error) {
    next(error);
  }
};

const getAll = async(req, res, next) => {
  try {
    const response = await trainService.getAllTrains();
    if (response.customErrorCode === 11) {
      const error = new Error(response.status);
      error.statusCode = 404;
      next(error);
    }
    res.send({ response });
  } catch (error) {
    next(error);
  }
};

const getById = async(req, res, next) => {
  const { id } = req.query;

  if (!id) {
    const message = 'Bad Request: train id param is required';
    const error = new Error(message);
    error.statusCode = constants.ERROR_400;
    next(error);
  } else {
    try {
      const response = await trainService.getTrainById(id);
      if (response.customErrorCode === 11) {
        const error = new Error(response.status);
        error.statusCode = 404;
        next(error);
      } else {
        res.send({ response });
      }
    } catch (error) {
      next(error);
    }
  }
};

module.exports = {
  create,
  update,
  getAll,
  getById
};
