import User from "./models/User.js";
import bcrypt from "bcryptjs";

export const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: "admin" });

        if (adminExists) {
            console.log("Admin existe déjà");
            return;
        }

        await User.create({
            nom: process.env.ADMIN_NOM || "Admin",
            prenom: process.env.ADMIN_PRENOM || "Default",
            email: process.env.ADMIN_EMAIL,
            password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
            role: "admin"
        });

        console.log(" Admin créé avec succès");
    } catch (error) {
        console.error("Erreur lors de la création de l’admin", error.message);
        process.exit(1);
    }
};
