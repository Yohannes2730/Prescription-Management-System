import express from "express";
import { 
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
  cancelPrescription
} from "../controllers/Prescription.controller.js";

const router = express.Router();

router.post("/create", createPrescription);
router.get("/", getAllPrescriptions);
router.get("/:id", getPrescriptionById);
router.put("/:id", updatePrescription);
router.put("/cancel/:id", cancelPrescription);

export default router;
