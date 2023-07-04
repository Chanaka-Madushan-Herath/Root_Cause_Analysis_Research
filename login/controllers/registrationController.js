const registerService = require('../services/registerService');
const constants = require('../utils/Constants');

const register = async(req, res, next) => {
  const {
    name, uName, password, email
  } = req.body;

  const missingParam =
    (!name && 'name') ||
    (!uName && 'uName') ||
    (!password && 'password') ||
    (!email && 'email');

  if (missingParam) {
    const message = `Bad Request: ${missingParam} param is required`;
    const error = new Error(message);
    error.statusCode = constants.ERROR_400;
    next(error);
  }

  try {
    const response = await registerService.register(name, uName, password, email);
    if (response.customErrorCode === 10) {
      const error = new Error(response.status);
      error.statusCode = 401;
      next(error);
    }

    res.send({ response });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register
};
