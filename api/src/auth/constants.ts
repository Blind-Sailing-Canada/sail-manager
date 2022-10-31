export const jwtConstants = {
  expiresIn: +process.env.JWT_EXPIRES_IN,
  secret: process.env.JWT_SECRET.replace(/\\n/gm, '\n'),
};

export const googleConstants = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};

export const DOMAIN = process.env.DOMAIN;
export const NOTIFICATIONS_EMAIL = process.env.NOTIFICATIONS_EMAIL;
export const RELEASE_FORM_URL = process.env.RELEASE_FORM_URL;
