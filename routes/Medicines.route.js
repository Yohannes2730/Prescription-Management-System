import express from "express";
import {insertMedicine,updateMedicine,deleteMedicine,searchMedicine,getMedicinesByExpiry,
  getMedicinesByQuantity,getShelfLife,} from "../controllers/Medicines.controller.js";

const router = express.Router();
router.post("/insert", insertMedicine);
router.put("/update/:id", updateMedicine);
router.delete("/delete/:id", deleteMedicine);
router.get("/search/:id", searchMedicine);
router.get("/expirySort", getMedicinesByExpiry);
router.get("/qtySort", getMedicinesByQuantity);
router.get("/shelfLife", getShelfLife);
export default router;

