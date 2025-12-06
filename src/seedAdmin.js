import User from "./models/User.js";

export const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: "admin" });
        if (adminExists) {
            console.log("Admin existe déjà");
            return;
        }

        const admin = new User({
            nom: process.env.ADMIN_NOM || "Admin",
            prenom: process.env.ADMIN_PRENOM || "Default",
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: "admin"
        });

        await admin.save(); 

        console.log("Admin créé avec succès");
    } catch (error) {
        console.error("Erreur lors de la création de l’admin", error.message);
        process.exit(1);
    }
};
