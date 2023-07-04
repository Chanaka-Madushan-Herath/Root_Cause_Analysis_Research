const express = require('express');
const trainController = require('./controllers/trainController');

const router = express.Router();

router.route('/api/add')
.post((req, res, next) => {
  return trainController.create(req, res, next);
});

router.route('/api/update')
.post((req, res, next) => {
  return trainController.update(req, res, next);
});

router.route('/api/trains')
.get((req, res, next) => {
  return trainController.getAll(req, res, next);
});

router.route('/api/train')
.get((req, res, next) => {
  return trainController.getById(req, res, next);
});


module.exports = router;
