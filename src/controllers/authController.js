import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import { formatUser } from "../utils/formatUser.js";

export const register = async (req, res) => {
    const { nom, prenom, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(409).json({ message: "Email déjà utilisé" });

    const user = await User.create({ nom, prenom, email, password, role: "user" });

    return res.status(201).json({
        success: true,
        message: "Inscription réussie !",
        // ...formatUser(user),
        // token: generateToken(user._id)
        data: {
            user: formatUser(user),
            accessToken: generateAccessToken(user._id),
            refreshToken: generateRefreshToken(user._id) }
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
        return res.status(404).json({ message: "Utilisateur introuvable" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
        return res.status(401).json({ message: "Mot de passe incorrect" });

    return res.status(200).json({
        // ...formatUser(user),
        // token: generateToken(user._id)
        success: true,
        message: "Connexion réussie !",
        data: {
            user: formatUser(user),
            accessToken: generateAccessToken(user._id),
            refreshToken: generateRefreshToken(user._id)
        }
    });
};



export const refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "Refresh token manquant" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

        const accessToken = generateAccessToken(user._id);
        res.status(200).json({ accessToken });
    } catch (err) {
        res.status(401).json({ message: "Refresh token invalide" });
    }
};