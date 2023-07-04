const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// eslint-disable-next-line import/no-unresolved
require('../schema/userData');

const User = mongoose.model('userData');
// eslint-disable-next-line camelcase
const jwt_secret = 'abcdwxyz123456';

const login = async(password, email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { status: 'User Not Found', customErrorCode: 11 };
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ user }, jwt_secret);
      return ({ status: 'ok', data: token });
    }
    return { status: 'Password not correct!', customErrorCode: 10 };
  } catch (e) {
    return { status: e };
  }
};

module.exports = {
  login
};
