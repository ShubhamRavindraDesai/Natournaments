const express = require('express');
const matchController = require('./../controllers/matchController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(matchController.getAllMatches)
  .post(
    authController.protect,
    matchController.uploadMatchImage,
    matchController.createMatch
  );

router
  .route('/:id')
  .get(matchController.getMatch)
  .patch(authController.protect, matchController.updateMatch)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead'),
    matchController.deleteMatch
  );

module.exports = router;
