require('dotenv').config()
const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const oauthController = require('../controllers/oauthController');


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/signin?toastMessage=Google%20login%20failed' }),
  oauthController.googleCallback
);


router.get('/google/signup', passport.authenticate('google-signup', { scope: ['profile', 'email'], prompt: 'select_account' }));
router.get('/google/signup/callback',
  passport.authenticate('google-signup', { failureRedirect: 'http://localhost:3000/signin?toastMessage=Google%20login%20failed' }),
  oauthController.googleSignupCallback
);

router.get('/logout', oauthController.logout);

module.exports = router;
