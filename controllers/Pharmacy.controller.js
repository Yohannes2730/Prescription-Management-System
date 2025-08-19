import Pharmacy from "../models/Pharmacy.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
export const register = async (req, res) => {
  try {
    const {name,licenseNumber,tinNumber,AdminName,AdminEmail,AdminPassword,
      Email,
      Contact,
      location,
      operatingHours,
      documents,
    } = req.body;
    const hashedPassword = await bcrypt.hash(AdminPassword, 10);
    const newPharmacy = new Pharmacy({name,licenseNumber,tinNumber,AdminName,AdminEmail,
      AdminPassword: hashedPassword,
      Email,
      Contact,
      location,
      operatingHours,
      documents,
    });
    await newPharmacy.save();
    const token = generateToken(newPharmacy._id);
    res.status(201).json({
      message: "Pharmacy registered successfully",
      pharmacy: {
        id: newPharmacy._id,
        name: newPharmacy.name,
        licenseNumber: newPharmacy.licenseNumber,
        tinNumber: newPharmacy.tinNumber,
        AdminName :newPharmacy.AdminName,
        AdminEmail : newPharmacy.AdminEmail,
        AdminPassword :newPharmacy.AdminPassword,
        Email: newPharmacy.Email,
        Contact: newPharmacy.Contact,
        documents: newPharmacy.documents,
        operatingHours: newPharmacy.operatingHours,
        createdAt: newPharmacy.createdAt,
      },
      token,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate field error",
        error: error.keyValue,
      });
    }
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const loginPharmacyAdmin = async (req, res) => {
  try {
    const { AdminEmail, AdminPassword } = req.body;
    const pharmacy = await Pharmacy.findOne({ AdminEmail });
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }
    const isMatch = await bcrypt.compare(AdminPassword, pharmacy.AdminPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: pharmacy._id, role: "pharmacy_admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Login successful",
      token,
      pharmacy: {
        id: pharmacy._id,
        name: pharmacy.name,
        licenseNumber: pharmacy.licenseNumber,
        Email: pharmacy.Email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const updatePharmacyProfile = async (req, res) => {
  try {
    const pharmacyId = req.user.id; 
    const updates = req.body;
    const updatedPharmacy = await Pharmacy.findByIdAndUpdate(
      pharmacyId,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updatedPharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }
    res.status(200).json({
      message: "Pharmacy profile updated successfully",
      pharmacy: updatedPharmacy,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
