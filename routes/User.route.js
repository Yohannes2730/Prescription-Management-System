const express = require('express');
const { register, login, getMe } = require('../controllers/User.controller.js');
const { protect } = require('../middleware/auth.js');
const { body } = require('express-validator');

const router = express.Router();
router.post('/register',[
  body('fullname').isString().trim().escape(),  
  body('email').isString().trim().escape(),
  body('phone').isString().trim().escape(),
  body('gender').isString().trim().escape(),
  body('password').isString().trim(),
  body('dateOfBirth').isISO8601().toDate().custom(date => {
    const min = new Date('1900-01-01');
    const max = new Date('2020-01-01');
    if (date < min || date > max) throw new Error('Date out of range');
    return true;
  })
], register);

router.post('/login',[
    body('emailorphone').isString().trim().escape(),
    body('password').isString().trim()
], login);
// router.post('/request-otp', requestOTP);
// router.post('/verify-otp', verifyOTP);

router.get('/dashboard', protect, getMe);

module.exports = router;