import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken, hashToken, verifyHashedToken } from "../utils/token.js";
import { formatUser } from "../utils/formatUser.js";
import logger from "../config/logger.js";

export const register = async (req, res) => {
    const { nom, prenom, email, password } = req.body;

    if (!email || !password || !nom || !prenom)
        return res.status(400).json({ message: "Champs requis manquants" });

    try {
        const exists = await User.findOne({ email });
        if (exists) return res.status(409).json({ message: "Email déjà utilisé" });

        const user = await User.create({ nom, prenom, email, password });

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = await hashToken(refreshToken);
        await user.save();

        logger.info(`User registered: ${email}`);

        res.status(201).json({
            success: true,
            user: formatUser(user),
            accessToken,
            refreshToken
        });
    } catch (err) {
        logger.error(`Register error: ${err.message}`);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = await hashToken(refreshToken);
        await user.save();

        logger.info(`User logged in: ${email}`);

        res.status(200).json({
            success: true,
            user: formatUser(user),
            accessToken,
            refreshToken
        });
    } catch (err) {
        logger.error(`Login error: ${err.message}`);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const logout = async (req, res) => {
    const { id } = req.user;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(400).json({ message: "Utilisateur introuvable" });

        user.refreshToken = null;
        await user.save();

        res.json({ message: "Déconnexion effectuée" });
    } catch (err) {
        logger.error(`Logout error: ${err.message}`);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const refreshToken = async (req, res) => {
    const { token } = req.body;

    if (!token) return res.status(401).json({ message: "Refresh token manquant" });

    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

        // Vérifier que le token correspond au hash stocké
        const isValid = await verifyHashedToken(token, user.refreshToken);
        if (!isValid) return res.status(401).json({ message: "Refresh token invalide" });

        // Générer de nouveaux tokens
        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        // Hasher et stocker le nouveau refresh token
        user.refreshToken = await hashToken(newRefreshToken);
        await user.save();

        logger.info(`Refresh token success: ${user.email}`);

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

    } catch (err) {
        logger.error(`Refresh token error: ${err.message}`);
        res.status(401).json({ message: "Refresh token invalide ou expiré" });
    }
};
