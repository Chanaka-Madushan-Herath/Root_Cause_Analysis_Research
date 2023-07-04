const loginService = require('../services/loginService');
const constants = require('../utils/Constants');

const login = async(req, res, next) => {
  const {
    password, email
  } = req.body;

  const missingParam =
    (!password && 'password') ||
    (!email && 'email');

  if (missingParam) {
    const message = `Bad Request: ${missingParam} param is required`;
    const error = new Error(message);
    error.statusCode = constants.ERROR_400;
    next(error);
  }

  try {
    const response = await loginService.login(password, email);
    if (response.customErrorCode === 10) {
      const error = new Error(response.status);
      error.statusCode = 401;
      next(error);
    }
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

module.exports = {
  login
};
