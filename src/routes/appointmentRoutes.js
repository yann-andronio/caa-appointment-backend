import express from "express";
import { createAppointment, getAppointments, updateAppointment, deleteAppointment , getAppointmentById } from "../controllers/appointmentController.js";
import { protect } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

// Tous les endpoints sont protégés (user doit être connecté)
// router.use(protect);

router.post("/createAppointment",protect , createAppointment);           
router.get("/",protect , getAppointments);             
router.get("/:id",protect , getAppointmentById);     
router.put("/:id",protect , updateAppointment);       
router.delete("/:id", protect ,deleteAppointment);    

export default router;
