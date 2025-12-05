import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());




app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/appointments', appointmentRoutes);

export default app;
