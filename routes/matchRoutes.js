const express = require('express')
const matchController = require('./../controllers/matchController')
const router = express.Router();
const multer = require('multer')

const upload = multer({dest: 'public/images'})

router
  .route('/')
    .get(matchController.getAllMatches)
    .post(upload.single('image'), matchController.createMatch)


router
  .route('/:id')
    .get(matchController.getMatch)
    .patch(matchController.updateMatch)
    .delete(matchController.deleteMatch)


module.exports = router;