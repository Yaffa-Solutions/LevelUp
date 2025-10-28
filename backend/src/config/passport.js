require('dotenv').config({ path: './.env' });
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('./db');

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
}, async (_, __, profile, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { google_id: profile.id } });
    if (!user) {
    // return done(null, false, { message: 'User not found' });
      return done(null, false, { email: profile.emails[0].value });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.use('google-signup', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/google/signup/callback`
}, async (_, __, profile, done) => {
  try {
    let user = await prisma.user.findUnique({ where: { google_id: profile.id } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: profile.emails[0].value,
          google_id: profile.id,
          first_name: profile.name?.givenName || 'Unknown',
          last_name: profile.name?.familyName || 'Unknown',
          role: 'TALENT',
          is_verified: true,
          levels: {
              connect: { id: 'e5c819d7-eb51-4595-aba2-e3475ce5a0eb' }  
          }
        }
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));


module.exports = passport;
