import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import hospitalRoutes from './routes/Hospital.route.js';
import pharmacyRoutes from './routes/Pharmacy.route.js'
import medicineRoutes from './routes/Medicines.route.js'
import prescriptionRoutes from "./routes/Prescription.route.js";
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use("/api/medicines", medicineRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/pharmacy',pharmacyRoutes)
app.use("/api/prescriptions", prescriptionRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
