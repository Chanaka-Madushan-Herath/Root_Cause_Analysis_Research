const config = require('config');
const requestPromise = require('../utils/requestpromise');
const nodemailer = require('nodemailer');

const urls = config.get('URLS');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'chanakamherath@gmail.com',
    pass: 'fwwnzdreuihrvmsi'
  }
});

const send = async(req, correlationId) => {
  const loggingOptions = { route: '/api/email' };
  const url = `${urls.LOGIN_SERVICE}/api/userData`;
  const token = req.headers.authorization;

  const userData = await requestPromise.get(url, token, correlationId, loggingOptions);
  if (userData.response.status === 'success') {
    const response = await transporter.sendMail({
      from: 'chanakamherath@gmail.com',
      bcc: userData.response.user.user.email,
      subject: 'Successfully Reserved!',
      text: `Hi ${userData.response.user.user.name}, Your reservation is successfully completed.`
    });
    return response;
  }
  throw userData;
};

const errorTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'chanakamherath@gmail.com',
    pass: 'fwwnzdreuihrvmsiw'
  }
});
const eSend = async(req, correlationId) => {

  const loggingOptions = { route: '/api/email' };
  const url = `${urls.LOGIN_SERVICE}/api/userData`;
  const token = req.headers.authorization;
  const userData = await requestPromise.get(url, token, correlationId, loggingOptions);
  if (userData.response.status === 'success') {
    const response = await errorTransporter.sendMail({
      from: 'chanakamherath@gmail.com',
      bcc: userData.response.user.user.email,
      subject: 'Successfully Reserved!',
      text: `Hi ${userData.response.user.user.name}`
    });
    return response;
  }
  throw userData;
};

const thErrSend = async(req, correlationId) => {
  const loggingOptions = { route: '/api/email' };
  const url = `${urls.LOGIN_SERVICE}/api/userData`;
  const token = req.headers.authorization;

  const userData = await requestPromise.get(url, undefined, correlationId, loggingOptions);
  if (userData.response.status && userData.response.status === 'success') {
    const response = await errorTransporter.sendMail({
      from: 'chanakamherath@gmail.com',
      bcc: userData.response.user.user.email,
      subject: 'Successfully Reserved!',
      text: `Hi ${userData.response.user.user.name}`
    });
    return response;
  }
  throw userData;
};

module.exports = {
  send,
  eSend,
  thErrSend
};
