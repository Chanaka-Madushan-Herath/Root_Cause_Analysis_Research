const reservationService = require('../services/reservationService');
const sanitizer = require('sanitizer');
const constants = require('constants');

const reservation = async(req, res, next) => {
  const correlationId = req.headers.correlationid || sanitizer.escape(req.correlationId());

  const { id, isError, ErrorType } = req.query;
  if (!id) {
    const message = 'Bad Request: train id param is required';
    const error = new Error(message);
    error.statusCode = constants.ERROR_400;
    next(error);
  }
  try {
    let emailResponse;
    const train = await reservationService.getTrain(req, id, correlationId);
    const user = await reservationService.getUser(req, correlationId);
    const response = await reservationService.reserve(train.train.response.data._id, user.userData.response.user.user._id);
    if (response.customErrorCode === 10) {
      const error = new Error(response.status);
      error.statusCode = 500;
      next(error);
    } else {
      if (isError === 'true') {
        if (ErrorType === '1') {
          emailResponse = await reservationService.errorSendMail(req, correlationId);
        } else {
          emailResponse = await reservationService.error2SendMail(req, correlationId);
        }
      } else {
        emailResponse = await reservationService.sendMail(req, correlationId);
      }
      res.send({
        response,
        emailResponse
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  reservation
};

