const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema(
    {
        fullname: {
            type: String,
            required: [true, 'enter your full name'],
            trim: true,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            validate: {
                validator: function (value) {
                    return !value || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
                },
                message: 'Invalid email format'
            },
            unique: true
        },
        phone: {
            type: String,
            trim: true,
            validate: {
            validator: function (value) {
                return !value || /^\+?\d{7,15}$/.test(value); // Supports international format
            },
            message: 'Invalid phone number format'
            },
            unique: true
        },
        password: {
            type: String,
            required: [true, 'enter your password'],
            trim: true,
            minLength: 8,
            validate: {
            validator: function (v) {
                return !v || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
            },
            message: 'Password must contain at least one capital letter, small letter and number'
            }
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: [true, "enter your gender"]
        },
        dateOfBirth: {
            type: Date,
            required: [true, "enter your date of birth"]
        },
        role: {
            type: String,
            enum: ['patient','doctor', 'pharmacist'],
            required: [true, "enter your role"]
        },

        //patient date
        medicationHistory: [{
            type: [{
                type: String
            }]
        }],
        allergies: [{
            type: String
        }],

        //doctor data
        specialization: { 
            type: String,
            default: 'general' 
        } ,
        licenseNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        yearsOfExperience: {
            type: Number
        },
        profilePicture: {
            type: String
        },
        bio: {
            type: String,
            minLength: 100
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: function() {
                if (this.role === 'doctor' || this.role === 'pharmacist') return 'inactive';
                return null;
            }
        },
    },
    {
        strict: true
    },
    {
        timestamps: true
    }
    
)

UserSchema.pre('save', function(next) {
  if (this.role === 'patient') {
    this.specialization = null;
    this.licenseNumber = null;
    this.yearsOfExperience = null;
    this.bio = null;
    this.status = null;
  } else if (this.role === 'pharmacist' || this.role === 'doctor') {
    this.hospital.allergies = null;
    this.medicationHistory = null;
  }
  this.updatedAt = Date.now();
  next();
});

UserSchema.pre('validate', function (next) {
  if (!this.email && !this.phone) {
    this.invalidate('email', 'Either email or phone number is required');
    this.invalidate('phone', 'Either email or phone number is required');
  }
  next();
});

UserSchema.pre('save',async function (next) {
    if (!this.isModified("password")) next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model("User", UserSchema);

module.exports = User