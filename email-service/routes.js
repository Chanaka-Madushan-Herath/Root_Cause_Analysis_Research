const express = require('express');
const emailController = require('./controllers/emailController');

const router = express.Router();
router.route('/api/email')
.post((req, res, next) => {
  return emailController.sendEmail(req, res, next);
});
router.route('/api/errorEmail')
.post((req, res, next) => {
  return emailController.ErrorSendEmail(req, res, next);
});
router.route('/api/errorEmail2')
.post((req, res, next) => {
  return emailController.Error2SendEmail(req, res, next);
});

module.exports = router;
