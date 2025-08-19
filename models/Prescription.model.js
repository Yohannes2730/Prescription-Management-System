
import mongoose from 'mongoose';

const { Schema } = mongoose;

const PHONE_REGEX = /^[+]?\d[\d\s()-]{7,15}$/;
const AddressSchema = new Schema(
  {
    region: { type: String, trim: true },
    Town: { type: String, trim: true },
    Wereda: { type: String, trim: true },
    Kebele: { type: String, trim: true },
    houseNo: { type: String, trim: true },
  },
  { _id: false }
);
const MedicationSchema = new Schema(
  {
    drugName: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[A-Za-z]{3,}/.test(v);
        },
        message: 'Medicine name should not be abbreviated.',
      },
    },
    strength: { type: String, trim: true },
    dosageForm: { type: String, trim: true },
    dose: { type: String, trim: true },
    frequency: { type: String, trim: true },
    duration: { type: String, trim: true },
    route: { type: String, trim: true },
    otherInfo: { type: String, trim: true },
    medicationDispensedQty: { type: Number, min: 1 },
    storageCondition: { type: String, trim: true },
  },
  { _id: true, timestamps: false }
);
const PrescriberSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    qualification: { type: String, trim: true },
    registrationNo: { type: String, trim: true },
    signature: { type: String, trim: true },
    date: { type: Date },

    verifiedByPrescriber: { type: Boolean, default: false },
  },
  { _id: false }
);
const DispenserSchema = new Schema(
  {
    fullName: { type: String, trim: true },
    qualification: { type: String, trim: true },
    registrationNo: { type: String, trim: true },
    signature: { type: String, trim: true },
    date: { type: Date },
    verifiedByDispenser: { type: Boolean, default: false },
  },
  { _id: false }
);
const PrescriptionSchema = new Schema(
  {
    formType: { type: String, default: 'Form 1: Standard prescription Paper', immutable: true },
    paperSerialNo: { type: String, trim: true },
    paperCodeOrSerial: { type: String, trim: true },
    institutionName: { type: String, required: true, trim: true },
    institutionTel: { type: String, trim: true, match: PHONE_REGEX },
    institutionSeal: { type: Boolean, required: true },
    isLegalDocument: { type: Boolean, default: true },
    patient: {
      fullName: { type: String, required: true, trim: true },
      sex: { type: String, enum: ['M', 'F', 'Other'], trim: true },
      ageYears: { type: Number, min: 0 },
      weightKg: { type: Number, min: 0 },
      cardNo: { type: String, trim: true },
      address: AddressSchema,
      tel: { type: String, trim: true, match: PHONE_REGEX },
      visitType: {
        type: String,
        enum: ['Inpatient', 'Outpatient', 'Emergency'],
        default: 'Outpatient',
      },
    },
    diagnosisICDCode: { type: String, trim: true },
    diagnosisText: { type: String, trim: true },
    medications: {
      type: [MedicationSchema],
      validate: [
        {
          validator: function (arr) {
            return Array.isArray(arr) && arr.length > 0;
          },
          message: 'At least one medication is required.',
        },
      ],
    },
    prescriber: PrescriberSchema,
    dispenser: DispenserSchema,
    counselingProvided: { type: Boolean, default: false },
    verbalInfoProvided: { type: Boolean, default: false },
    retentionPeriodYears: { type: Number, default: 2 },
    issuedAt: { type: Date },
  },
  { timestamps: true }
);
PrescriptionSchema.index({ 'patient.cardNo': 1 });
PrescriptionSchema.index({ paperSerialNo: 1 });

export default mongoose.model('Prescription', PrescriptionSchema);
