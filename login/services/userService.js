const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// eslint-disable-next-line import/no-unresolved
require('../schema/userData');

const User = mongoose.model('userData');
// eslint-disable-next-line camelcase
const jwt_secret = 'abcdwxyz123456';

const getHandler = async(token) => {
  try {
    const user = await jwt.verify(token, jwt_secret);
    if (user) {
      if (user.user._id) {
        return { status: 'success', user };
      }
    }
    return { status: 'User not Found', customErrorCode: 11 };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getHandler
};
