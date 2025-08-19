import jwt from "jsonwebtoken";
import Medicine from "../models/Medicines.model.js"; 
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const insertMedicine = async (req, res) => {
  try {
    const { med_name, qnty_left, med_cost, exp_date, med_mfg, rac_loc, mfg_date } = req.body;
    const newMedicine = new Medicine({
      med_name, qnty_left, med_cost, exp_date, med_mfg, rac_loc, mfg_date,});
    await newMedicine.save();
    res.status(201).json({
      message: "Medicine inserted successfully",
      medicine: newMedicine,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    }
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;              
    const { med_cost } = req.body;  
    if (!id) {
      return res.status(400).json({ message: "id is required in params" });
    }
    if (med_cost === undefined) { 
      return res.status(400).json({ message: "med_cost is required in body" });
    }
    const costNum = Number(med_cost);
    if (!Number.isFinite(costNum) || costNum < 0) {
      return res.status(400).json({ message: "med_cost must be a non-negative number" });
    }
    const updatedMedicine = await Medicine.findByIdAndUpdate(
      id,
      { $set: { med_cost: costNum } },
      { new: true, runValidators: true, context: "query" }
    );
    if (!updatedMedicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.status(200).json({
      message: "Medicine cost updated successfully",
      medicine: updatedMedicine,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteMedicine = async (req, res) => {
  try {
    const { id, med_name } = req.params;
    if (!id && !med_name) {
      return res.status(400).json({ message: "Provide id or med_name in params" });
    }
    const deletedMedicine = id
      ? await Medicine.findByIdAndDelete(id)
      : await Medicine.findOneAndDelete({ med_name });
    if (!deletedMedicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.status(200).json({
      message: "Medicine deleted successfully",
      medicine: deletedMedicine,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const searchMedicine = async (req, res) => {
  try {
    const { id, med_name } = req.params;
    if (!id && !med_name) {
      return res.status(400).json({ message: "Provide id or med_name in parametr" });
    }
    const medicine = id
      ? await Medicine.findById(id)
      : await Medicine.findOne({ med_name });
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.status(200).json(medicine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getMedicinesByExpiry = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ exp_date: 1 });
    res.status(200).json(medicines);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
export const getMedicinesByQuantity = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ qty_left: 1 });
    res.status(200).json(medicines);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
export const getShelfLife = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    const result = medicines.map((med) => {
      const years = med.exp_date.getFullYear() - med.mfg_date.getFullYear();
      const months =
        med.exp_date.getMonth() - med.mfg_date.getMonth() + years * 12;
      return {
        id: med._id,
        med_name: med.med_name,
        shelf_life_years: Math.floor(months / 12),
        shelf_life_months: months % 12,
      };
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
