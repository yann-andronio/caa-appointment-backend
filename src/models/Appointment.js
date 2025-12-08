import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    hour: { type: String, required: true },
    noteUser: { type: String },         
    status: {
        type: String,
        enum: ["en attente", "confirmé", "refusé", "annulé"],
        default: "en attente"
    }
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
