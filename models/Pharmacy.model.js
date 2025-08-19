import mongoose from "mongoose";

const pharmacySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      unique: true,
      required: [true, "Please enter your name" ]
    },
    licenseNumber: {
      type: String,
      required: [true, "Enter your license Number"],
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[A-Z0-9-]{6,20}$/.test(v); 
        },
        message: props => `${props.value} is not a valid license number`
      }
    },
    tinNumber: {
      type: String, 
      required: [true, "Enter your TIN Number"],
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v); 
        },
        message: props => `${props.value} is not a valid TIN number`
      }
    },
    AdminName: { type: String, required: true },
    AdminEmail: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, "Enter admin email"],
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: props => `${props.value} is not a valid email`
      }
    },
    AdminPassword: {
      type: String,
      required: [true, "Enter your password"],
      trim: true,
      minlength: 8,
      validate: {
        validator: function (v) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      },
    },
    Email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, "Enter email"],
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: props => `${props.value} is not a valid email`
      }
    },
    Contact: { 
      type: String, 
      trim: true, 
      unique: true, 
      required: [true, "Enter phone number"],
      validate: {
        validator: function (value) {
          return /^\+?\d{7,15}$/.test(value);
        },
        message: "Invalid phone number format",
      },
    },
    location: {
      region: { type: String, required: [true, "Enter region"] },
      cityOrZone: { type: String, required: [true, "Enter city"] },
      subCity: { type: String, required: [true, "Enter subCity"]},
      woreda: { type: String, required: [true, "Enter woreda"] },
    },
    operatingHours: {
      from: { type: String },
      to: { type: String }
    },
    documents: {
      licenseFileUrl: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return /^https?:\/\/.+/.test(v); 
          },
          message: props => `${props.value} is not a valid license file URL`
        }
      },
      tinCertificateUrl: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return /^https?:\/\/.+/.test(v);
          },
          message: props => `${props.value} is not a valid TIN certificate URL`
        }
      },
      ownerIdFileUrl: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return /^https?:\/\/.+/.test(v);
          },
          message: props => `${props.value} is not a valid owner ID file URL`
        }
      },
      verified: { type: Boolean, default: false },
      rejected: { type: Boolean, default: false },
      rejectionReason: { type: String }
    },
  },
  { timestamps: true }
);
const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);
export default Pharmacy;
