const jwt = require('jsonwebtoken');
const User = require('../models/User.model.js');
 const OTP = require('../models/OTPverification.model.js')
 const { transporter, sendOTP } = require('../utils/email.js')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const register = async (req, res) => {
    const { fullname, email, phone, gender, password, dateOfBirth } = req.body;
    try {
        const newUser = new User({
            fullname,
            email,
            phone,
            gender,
            password,
            dateOfBirth,
            status
        });

        if (status=='patient') {
            const { medicationHistory, allergies} = req.body;
            User.medicationHistory = medicationHistory
            User.allergies = alleries
        } else if (status=='doctor' || status=='pharmacist') {
            const { specialization, yearsOfExperience, licenseNumber, bio } = req.body;
            User.specialization = specialization
            User.yearsOfExperience = yearsOfExperience
            User.licenseNumber = licenseNumber
            User.bio = bio
        }

        await newUser.save();
        console.log('user saved')

        const token = generateToken(newUser._id);
        console.log(`token generated ${token}`)

        res.status(201).json({
            message: 'User registered successfully!',
            fullname: newUser.fullname,
            phone: newUser.phone || undefined,
            email: newUser.email || undefined,
            gender: newUser.gender,
            dateOfBirth: newUser.dateOfBirth,
            token
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = {};
            for (let field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ errors });
        } else if (error.code === 11000) {
            return res.status(409).json({ message: 'Email or username already exists.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email: email});
        if (!user || (!(await user.matchPassword(password)))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user._id);
        res.status(200).json({
            message: 'User logged in successfully!',
            fullname: user.fullname,
            phone: user.phone,
            email: user.email,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

const requestOTP = async (req, res) => {
    const { userId, email } = req.body;

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 
    await OTP.create({ userId, email, otp: otpCode, expiresAt });
    await sendOTP(email, otpCode);

    res.json({ message: 'OTP sent successfully' });
}

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const record = await OTP.findOne({ email, otp });
  if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

  res.json({ message: 'OTP verified successfully' });
};

module.exports = { register, login, getMe };