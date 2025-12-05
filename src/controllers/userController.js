import User from "../models/User.js";
import { formatUser } from "../utils/formatUser.js";


export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            message: "Liste des utilisateurs",
            data: users.map(formatUser)
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: err.message
        });
    }
};


export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ success: false, message: "Utilisateur introuvable" });

        res.status(200).json({
            success: true,
            message: "Utilisateur trouvé",
            data: formatUser(user)
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: err.message
        });
    }
};


export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, ...rest } = req.body;

        let updatedUser;

        if (password) {
            // si il y a un modif sur mdp (post mdp by front )
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ success: false, message: "Utilisateur introuvable" });

            user.password = password;
            Object.assign(user, rest);      
            updatedUser = await user.save(); // mi resave donc redeclanche le hache du mdp selon la condition @model
        } else {
            // Update rapide pour les autres champs
            //runValidators: true → vérifie les règles du modèle (required, enum, etc.)
            updatedUser = await User.findByIdAndUpdate(id, rest, { new: true, runValidators: true });
            if (!updatedUser) return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
        }

        res.status(200).json({
            success: true,
            message: "Utilisateur mis à jour",
            data: formatUser(updatedUser)
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: err.message
        });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ success: false, message: "Utilisateur introuvable" });

        res.status(200).json({
            success: true,
            message: "Utilisateur supprimé"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: err.message
        });
    }
};
