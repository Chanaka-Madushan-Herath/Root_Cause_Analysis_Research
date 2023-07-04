const userService = require('../services/userService');

const getUser = async(req, res, next) => {
  const token = req.headers.Authorization || req.headers.authorization;

  try {
    await userService.getHandler(token).then((response) => {
      if (response.customErrorCode === 11) {
        const error = new Error(response.status);
        error.statusCode = 404;
        next(error);
      }
      if (response.customErrorCode === 10) {
        const error = new Error(response.status);
        error.statusCode = 400;
        next(error);
      }
      res.send({ response });
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUser
};

