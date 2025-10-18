const oauthService = require('../services/oauthService');
const userService = require('../services/userService');

const googleCallback = async (req, res) =>{
  try {
    if (!req.user) {
      return res.redirect(`http://localhost:3000/signup?toastMessage=${encodeURIComponent(email)}`);
    }
    const user = await userService.getUserByEmail(req.user.email); 

    if (!user) {
      return res.redirect(`http://localhost:3000/signup?toastMessage=${encodeURIComponent(req.user.email)}`);
    }

    const token = oauthService.generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production', 
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000    
    });

    if (!user.first_name || !user.last_name) {
      res.redirect(`http://localhost:3000/create-profile`);
    } else {
      res.redirect(`http://localhost:3000/home`);
    }
  } catch (err) {
    console.error(err);
    res.redirect('/signin');
  }
}

const googleSignupCallback = async (req, res) => {
  try {
    const user = req.user; 
    if (!user|| !req.user.email) {
      return res.redirect('http://localhost:3000/signup');
    }

    const token = oauthService.generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000
    });

    if (!user.first_name || !user.last_name) {
      res.redirect('http://localhost:3000/create-profile');
    } else {
      res.redirect('http://localhost:3000/home');
    }
  } catch (err) {
    console.error(err);
    res.redirect('http://localhost:3000/signup');
  }
};

const logout = async (req, res) => {
  try {
    await oauthService.destroySession(req, res);
    res.redirect('http://localhost:3000/signin');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Logout failed' });
  }
};

module.exports = { 
  googleCallback, 
  googleSignupCallback,
  logout, 
 };
