import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken, hashToken , verifyHashedToken } from "../utils/token.js";
import { formatUser } from "../utils/formatUser.js";
import logger from "../config/logger.js";

export const register = async (req, res) => {
    const { nom, prenom, email, password } = req.body;

    if (!email || !password || !nom || !prenom)
        return res.status(400).json({ message: "Champs requis manquants" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email déjà utilisé" });

    const user = await User.create({ nom, prenom, email, password });

    const access = generateAccessToken(user._id);
    const refresh = generateRefreshToken(user._id);
    const hashedRefresh = await hashToken(refresh);

    user.refreshToken = hashedRefresh;
    await user.save();

    logger.info(`User registered: ${email}`);

    res.status(201).json({
        success: true,
        user: formatUser(user),
        accessToken: access,
        refreshToken: refresh
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            logger.warn(`Login failed: user not found - ${email}`);
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            logger.warn(`Login failed: wrong password - ${email}`);
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        const access = generateAccessToken(user._id);
        const refresh = generateRefreshToken(user._id);
        const hashedRefresh = await hashToken(refresh);


        user.refreshToken = hashedRefresh;
        await user.save();

        logger.info(`User logged in: ${email}`);

        return res.status(200).json({
            success: true,
            user: formatUser(user),
            accessToken: access,
            refreshToken: refresh
        });
    } catch (err) {
        logger.error(`Login error: ${err.message}`);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};



export const logout = async (req, res) => {
    const { id } = req.user;

    const user = await User.findById(id);
    if (!user) return res.status(400).json({ message: "Utilisateur introuvable" });

    user.refreshToken = null;
    await user.save();

    res.json({ message: "Déconnexion effectuée" });
};




export const refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        logger.warn("Refresh token manquant");
        return res.status(401).json({ message: "Refresh token manquant" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            logger.warn(`Refresh failed: user not found - ${decoded.id}`);
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        // Vérifier que le refresh token correspond à celui en DB
        const isValid = await verifyHashedToken(token, user.refreshToken);
        if (!isValid) return res.status(401).json({ message: "Refresh token invalide" });


        const newAccess = generateAccessToken(user._id);
        const newRefresh = generateRefreshToken(user._id);
        const hashedNewRefresh = await hashToken(newRefresh);

        user.refreshToken = hashedNewRefresh;
        await user.save();

        logger.info(`Refresh token success: ${user.email}`);

        res.json({ accessToken: newAccess, refreshToken: newRefresh });
    } catch (err) {
        logger.error(`Refresh token error: ${err.message}`);
        return res.status(401).json({ message: "Refresh token invalide ou expiré" });
    }
};
