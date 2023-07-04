const express = require('express');
const reservationController = require('./controllers/reservationController');

const router = express.Router();
router.route('/api/reserve')
.post((req, res, next) => {
  return reservationController.reservation(req, res, next);
});

module.exports = router;
