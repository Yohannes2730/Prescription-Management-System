import mongoose from 'mongoose';
const medicineSchema = new mongoose.Schema({
  med_name: {
    type: String,
    required: [true, "Medicine name is required"],
    trim: true,
  },
  qnty_left: {
    type: Number,
    required: [true, "Quantity left is required"],
    min: [0, "Quantity cannot be negative"],
  },
  med_cost: {
    type: Number,
    required: [true, "Medicine cost is required"],
    min: [0, "Cost cannot be negative"],
  },
  med_mfg: {
    type: String,
    required: [true, "Manufacturer is required"],
    trim: true,
  },
  rac_loc: {
    type: String,
    required: [true, "Rack location is required"],
    trim: true,
  },
  mfg_date: {
    type: Date,
    required: [true, "Manufacturing date is required"],
    validate: {
      validator: function (v) {
        return v <= new Date();
      },
      message: props => `Manufacturing date cannot be in the future`,
    },
  },
  exp_date: {
    type: Date,
    required: [true, "Expiry date is required"],
    validate: {
      validator: function (v) {
        return v > new Date();
      },
      message: props => `Expiry date must be in the future`,
    },
  },
}, { timestamps: true });
const medicines = mongoose.model('medicine',medicineSchema)
export default medicines;
