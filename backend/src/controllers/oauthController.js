const oauthService = require('../services/oauthService');

const googleCallback = async (req, res) =>{
  try {
    const user = req.user;

    const token = oauthService.generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000    
    });

    if (!user.first_name || !user.last_name) {
      res.redirect(`http://localhost:3000/create-profile?token=${token}`);
    } else {
      res.redirect(`http://localhost:3000/home?token=${token}`);
    }
  } catch (err) {
    console.error(err);
    res.redirect('/signin');
  }
}
module.exports = { googleCallback };
