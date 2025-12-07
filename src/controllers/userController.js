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
        const { password, role, ...rest } = req.body;


        const user = await User.findById(id);
        if (!user) return res.status(404).json({ success: false, message: "Utilisateur introuvable" });

        if (role && req.user.role !== "admin") {
            return res.status(403).json({ message: "Vous ne pouvez pas modifier le rôle" });
        }

       
        if (req.user.role !== "admin" && req.user._id.toString() !== id) {
            return res.status(403).json({ success: false, message: "Vous ne pouvez modifier que votre compte" });
        }


        if (role && req.user.role === "admin") {
            user.role = role;
        }
     
        if (password) user.password = password;

        // MAJ autres champs
        Object.assign(user, rest);
        const updatedUser = await user.save();

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
