import Appointment from "../models/Appointment.js";


export const createAppointment = async (req, res) => {
    try {
        const { type, date, hour, noteUser } = req.body;
        const userId = req.user._id;

        const newAppointment = await Appointment.create({ userId, type, date, hour, noteUser});

        res.status(201).json({
            success: true,
            message: "Rendez-vous créé",
            data: newAppointment,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Récupérer les rendez-vous (admin peut voir tous, user seulement les siens)
export const getAppointments = async (req, res) => {
    try {
        let appointments;
        if (req.user.role === "admin") {
            appointments = await Appointment.find().populate("userId", "nom prenom email");
        } else {
            appointments = await Appointment.find({ userId: req.user._id });
        }

        res.status(200).json({ success: true, data: appointments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


// Récupérer un rendez-vous précis
export const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findById(id).populate("userId", "nom prenom email");
        if (!appointment) return res.status(404).json({ success: false, message: "Rendez-vous introuvable" });

        // Si user, vérifier que c'est son rdv
        if (req.user.role !== "admin" && appointment.userId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Vous ne pouvez voir que vos rendez-vous" });
        }

        res.status(200).json({ success: true, data: appointment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


export const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, ...rest } = req.body;

        let updateData = { ...rest }; // les autres champs modifiables par le user

        // Définir les status autorisés selon le rôle
        const statusAutorises  = {
            admin: ["confirmé", "refusé"],
            user: ["annulé"]
        };

        if (status) {
            if (!statusAutorises[req.user.role].includes(status)) {
                return res.status(403).json({
                    success: false,
                    message: `Le status '${status}' n'est pas autorisé pour votre rôle`
                });
            }
            updateData.status = status;
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Rendez-vous mis à jour",
            data: updatedAppointment
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};




// Supprimer un rendez-vous (user supprime son rdv)
export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        await Appointment.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Rendez-vous supprimé" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

