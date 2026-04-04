import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_, __, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase().trim();

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value,
            role: "student",
            isVerified: true,
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          user.avatar = user.avatar || profile.photos?.[0]?.value;
          user.isVerified = true;
          await user.save({ validateBeforeSave: false });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
