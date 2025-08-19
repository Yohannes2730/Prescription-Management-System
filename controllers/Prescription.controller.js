import Prescription from "../models/Prescription.model.js";
export const createPrescription = async (req, res) => {
  try {
    const {institutionName,institutionTel,institutionSeal,patient,
      diagnosisICDCode,
      diagnosisText,
      medications,
      prescriber
    } = req.body;
    if (!institutionName || !institutionSeal) {
      return res.status(400).json({ message: "Institution name and seal are required" });
    }
    if (!patient || !patient.fullName || patient.ageYears === undefined) {
      return res.status(400).json({ message: "Patient information is incomplete" });
    }
    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      return res.status(400).json({ message: "At least one medication is required" });
    }
    if (!prescriber || !prescriber.fullName || !prescriber.signature) {
      return res.status(400).json({ message: "Prescriber information is incomplete" });
    }
    const newPrescription = new Prescription({institutionName,institutionTel,institutionSeal,
      patient,
      diagnosisICDCode,
      diagnosisText,
      medications,
      prescriber: {
        ...prescriber,
        verifiedByPrescriber: false,
        date: new Date(),
      },
      issuedAt: new Date(),
    });
    await newPrescription.save();
    res.status(201).json({message: "Prescription created successfully",
      prescription: newPrescription, });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    }
    console.error(error);
    res.status(500).json({ message: "Server error while creating prescription", error: error.message });
  }
};
export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.status(200).json(prescriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ message: "Prescription not found" });
    res.status(200).json(prescription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ message: "Prescription not found" });
    const allowedFields = {
      diagnosisText: true,
      diagnosisICDCode: true,
      medications: true,
      "patient.visitType": true,
    };
    let updated = false; Object.keys(req.body).forEach((field) => {
      if (allowedFields[field]) {
        if (field.includes(".")) {
          const keys = field.split(".");
          prescription[keys[0]][keys[1]] = req.body[field];
        } else {
          prescription[field] = req.body[field];
        }
        updated = true;
      }
    });
    if (!updated) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }
    prescription.prescriber.verifiedByPrescriber = false;
    prescription.prescriber.date = new Date();
    await prescription.save();
    res.status(200).json({
      message: "Prescription updated successfully",
      prescription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const cancelPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ message: "Prescription not found" });
    prescription.isLegalDocument = false;
    prescription.cancellationReason = req.body.reason || "Cancelled by prescriber";
    prescription.prescriber.date = new Date();
    await prescription.save();
    res.status(200).json({ message: "Prescription cancelled successfully", prescription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
