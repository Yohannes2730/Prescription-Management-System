import jwt from "jsonwebtoken";
import Hospital from "../models/Hospital.model.js";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
export const register = async (req, res) => {
  try {
    const {
      name,location,licenseNumber,Email,Contact,AdminEmail,AdminPassword,operatingHours,
      isActive,} = req.body;
    const hashPassword = await bcrypt.hash(AdminPassword, 8,);
    const newHospital = new Hospital({name,location,licenseNumber,Email,Contact,AdminEmail,
      AdminPassword: hashPassword, 
      operatingHours,
      isActive, });
    await newHospital.save();
    const token = generateToken(newHospital._id);
    res.status(201).json({
      message: "Hospital registered successfully",
      hospital: {
        name: newHospital.name,
        location: newHospital.location,
        licenseNumber: newHospital.licenseNumber,
        Email: newHospital.Email,
        Contact: newHospital.Contact,
        operatingHours: newHospital.operatingHours,
        isActive: newHospital.isActive,
        createdAt: newHospital.createdAt,
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
      return res
        .status(409)
        .json({ message: "Duplicate field error", error: error.keyValue });
    }
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const loginHospitalAdmin = async (req, res) => {
  try {
    const { AdminEmail, AdminPassword } = req.body;
    const hospital = await Hospital.findOne({ AdminEmail });
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    const isMatch = await hospital.matchPassword(AdminPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(hospital._id);
    res.status(200).json({
      message: "Login successful",
      token,
      hospital: {
        id: hospital._id,
        name: hospital.name,
        email: hospital.AdminEmail,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const updateHospitalProfile = async (req, res) => {
  try {
    const hospitalId = req.params.id; 
    const allowedFields = [
      "name",
      "Email",
      "Contact",
      "operatingHours",
      "isActive",
      "location.Region",
      "location.CityOrZone",
      "location.subCity",
      "location.wereda",
      "location.longitude",
      "location.latitude",
    ];
    const updates = {};
    allowedFields.forEach((field) => {
      if (_.has(req.body, field)) {
        _.set(updates, field, _.get(req.body, field));
      }
    });
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }
    const updatedHospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updatedHospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    res.status(200).json({
      message: "Hospital profile updated successfully",
      hospital: updatedHospital,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
