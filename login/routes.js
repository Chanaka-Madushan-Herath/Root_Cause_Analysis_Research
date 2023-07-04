const express = require('express');
const registrationController = require('./controllers/registrationController');
const loginController = require('./controllers/loginController');
const userController = require('./controllers/userController');
const statusController = require('./controllers/statusController');

const router = express.Router();
router.route(['/health', '/status']).get((req, res) => statusController.getStatus(req, res));


router.route('/api/register')
.post((req, res, next) => {
  return registrationController.register(req, res, next);
});

router.route('/api/login')
.post((req, res, next) => {
  return loginController.login(req, res, next);
});

router.route('/api/userData')
.get((req, res, next) => {
  return userController.getUser(req, res, next);
});

module.exports = router;
