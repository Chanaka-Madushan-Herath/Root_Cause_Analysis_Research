const emailService = require('../services/emailService');


const sendEmail = async(req, res, next) => {
  const correlationId = req.headers.correlationid;
  try {
    await emailService.send(req, correlationId)
    .then((response) => res.send({ response }));
  } catch (error) {
    next(error);
  }
};

const ErrorSendEmail = async(req, res, next) => {
  const correlationId = req.headers.correlationid;
  try {
    await emailService.eSend(req, correlationId)
    .then((response) => res.send({ response }));
  } catch (error) {
    next(error);
  }
};

const Error2SendEmail = async(req, res, next) => {
  const correlationId = req.headers.correlationid;
  try {
    await emailService.thErrSend(req, correlationId)
    .then((response) => res.send({ response }));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendEmail,
  ErrorSendEmail,
  Error2SendEmail
};

