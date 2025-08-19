import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginPharmacyAdmin, updatePharmacyProfile,register } from '../controllers/Pharmacy.controller.js';

const router = express.Router();
router.post("/register",register)
router.post('/login',loginPharmacyAdmin )
router.put('/update',updatePharmacyProfile )

export default router;
