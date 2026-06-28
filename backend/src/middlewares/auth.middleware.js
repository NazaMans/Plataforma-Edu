import passport from "passport";

export const verificarAutenticacion = passport.authenticate("jwt", { session: false });