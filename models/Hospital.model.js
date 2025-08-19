import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Enter your hospital name'] },
  location: {
    Region: { type: String, required: [true, 'Enter region'] },
    CityOrZone: { type: String, required: [true, 'Enter city or zone'] },
    subCity: { type: String, required: [true, 'Enter subcity'] },
    wereda: { type: String, required: [true, 'Enter wereda'] },
    longitude: { type: Number },
    latitude: { type: Number }
  },
  licenseNumber: {
    type: String,
    required: [true,'Enter your license Number'],
    unique: true,
    trim : true,
    validate: {
      validator: function (v) {
        return /^[A-Z0-9-]{10,20}$/.test(v); 
      },
      message: props => `${props.value} is not a valid license number`
    }
  },
  Email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: [true, 'Enter email'],
    validate: {
      validator: function (v) {  // <-- Use v, not value
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: props => `${props.value} is not a valid email`
    }
  },
  Contact: { 
    type: String, 
    trim: true, 
    unique: true, 
    required: [true, 'Enter phone number'],
    validate: {
      validator: function (v) {
        return /^\+?\d{7,15}$/.test(v);
      },
      message: props => 'Invalid phone number format',
    },
  },
  AdminEmail: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: [true, 'Enter admin email'],
    validate: {
      validator: function (v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: props => `${props.value} is not a valid email`
    }
  },
  AdminPassword: {
  type: String,
  required: [true, 'Enter your password'],
  trim: true,
  minlength: 8,
  validate: {
    validator: function (v) {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
    },
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  },
},
  operatingHours: { from: String, to: String },
  isActive: { type: Boolean, default: true },
}, {
  strict: true,
  timestamps: true
});

HospitalSchema.pre('save', async function(next) {
  if (!this.isModified('AdminPassword')) return next();
  const salt = await bcrypt.genSalt(10);
  this.AdminPassword = await bcrypt.hash(this.AdminPassword, salt);  // <-- Use correct field
  next();
});
HospitalSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.AdminPassword);
};
const Hospital = mongoose.model('Hospital', HospitalSchema);
export default Hospital;
