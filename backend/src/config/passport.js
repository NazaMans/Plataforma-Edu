import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
dotenv.config();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

export const passportConfig = () => {
    passport.use(
        new Strategy(options, async (payload, done) => {
            return done(null, payload);
        })
    )
}