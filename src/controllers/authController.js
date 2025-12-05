import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { formatUser } from "../utils/formatUser.js";

export const register = async (req, res) => {
    const { nom, prenom, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(409).json({ message: "Email déjà utilisé" });

    const user = await User.create({ nom, prenom, email, password });

    return res.status(201).json({
        success: true,
        message: "Inscription réussie !",
        // ...formatUser(user),
        // token: generateToken(user._id)
        data: { ...formatUser(user), token: generateToken(user._id) }
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
        data: { ...formatUser(user), token: generateToken(user._id) }
    });
};
