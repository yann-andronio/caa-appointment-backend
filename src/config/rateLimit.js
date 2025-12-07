import rateLimit from "express-rate-limit";

// Limite brute-force sur /login
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute
    max: 5, // max 5 tentatives par minute
    message: {
        success: false,
        message: "Trop de tentatives de connexion. Réessayez dans 15 minute."
    },
    standardHeaders: true,
    legacyHeaders: false,
});


export const registerLimiter = rateLimit({
    windowMs: 60 * 1000, //1 minute
    max: 3,
    message: "Trop de créations de comptes. Réessayez plus tard."
});