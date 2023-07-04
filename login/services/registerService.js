const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-unresolved
require('../schema/userData');

const User = mongoose.model('userData');

const register = async(name, uName, password, email) => {
  const encryptPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return { status: 'User already registered! ', customErrorCode: 10};
    }
    console.log(uName);
    const response = await User.create({
      name,
      uName,
      password: encryptPassword,
      email
    });

    return { response };
  } catch (e) {
    return ({ status: e });
  }
};

module.exports = {
  register
};
