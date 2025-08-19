import express from 'express';
import {register,updateHospitalProfile,loginHospitalAdmin} 
from '../controllers/Hospital.controller.js'

const router = express.Router();

router.post('/register', register)
router.put('/update/:id', updateHospitalProfile);
router.post('/login',loginHospitalAdmin)

export default router;
