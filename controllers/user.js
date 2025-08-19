 export const UserRegistor = ()=>{
     async (req, res) => {
  const { fullname, email, phone, gender, password, dateOfBirth } = req.body;
  try {
    const newUser = new User({
      fullname,
      email,
      phone,
      gender,
      password,
      dateOfBirth,
    });
    await newUser.save();
    const token = generateToken(newUser._id);
    res.status(201).json({
      message: 'User registered successfully!',
      fullname: newUser.fullname,
      phone: newUser.phone,
      email: newUser.email,
      gender: newUser.gender,
      dateOfBirth: newUser.dateOfBirth,
      token,
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
     }
}

export const UserLogin = ()=>{
    async (req, res) => {
  try {
    const { emailorphone, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: emailorphone }, { phone: emailorphone }],
    });
    if (!user || !(await user.matchPassword(password))) {
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
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
}