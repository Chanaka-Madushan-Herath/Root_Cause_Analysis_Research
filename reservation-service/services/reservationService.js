const config = require('config');
const requestPromise = require('../utils/requestpromise');

const loggingOptions = { route: '/api/reserve' };
const urls = config.get('URLS');
require('../schema/reservation');
const mongoose = require('mongoose');

const Reservation = mongoose.model('reservation');

const getTrain = async(req, id, correlationId) => {
  const url = `${urls.TRAIN_SERVICE}/api/train?id=${id}`;
  const token = req.headers.authorization;
  try {
    const train = await requestPromise.get(url, token, correlationId, loggingOptions);
    if (train) {
      return { train };
    }
  } catch (e) {
    throw e;
  }
};

const getUser = async(req, correlationId) => {
  const url = `${urls.LOGIN_SERVICE}/api/userData`;
  const token = req.headers.authorization;
  try {
    const userData = await requestPromise.get(url, token, correlationId, loggingOptions);
    if (userData.response !== undefined && userData.response.status === 'success') {
      return { userData };
    }
    throw userData;
  } catch (e) {
    console.log('hi');
    console.log(e);
    throw e;
  }
};

const reserve = async(trainId, userId) => {
  try {
    const response = await Reservation.create({
      trainId,
      userId
    });

    return { status: 'successfully reserved', response };
  } catch (e) {
    return ({ status: e });
  }
};

const sendMail = async(req, correlationId) => {
  const url = `${urls.EMAIL_SERVICE}/api/email`;
  const token = req.headers.authorization;
  const options = {
    headers: {
      'authorization': token,
      'json': true
    }
  };
  try {
    const emailData = await requestPromise.post(url, options, correlationId, loggingOptions);
    if (emailData.response.accepted !== undefined) {
      return { emailData };
    }
    throw emailData;
  } catch (e) {
    throw e;
  }
};
const errorSendMail = async(req, correlationId) => {
  const url = `${urls.EMAIL_SERVICE}/api/errorEmail`;
  const token = req.headers.authorization;
  const options = {
    headers: {
      'authorization': token,
      'json': true
    }
  };
  try {
    const emailData = await requestPromise.post(url, options, correlationId, loggingOptions);
    if (emailData.response.accepted !== undefined) {
      return { emailData };
    }
    throw emailData;
  } catch (e) {
    throw e;
  }
};
const error2SendMail = async(req, correlationId) => {
  const url = `${urls.EMAIL_SERVICE}/api/errorEmail2`;
  const token = req.headers.authorization;
  const options = {
    headers: {
      'authorization': token,
      'json': true
    }
  };
  try {
    const emailData = await requestPromise.post(url, options, correlationId, loggingOptions);
    if (emailData.response.accepted !== undefined) {
      return { emailData };
    }
    throw emailData;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getTrain,
  getUser,
  reserve,
  sendMail,
  errorSendMail,
  error2SendMail
};
