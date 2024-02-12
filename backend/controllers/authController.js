const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Create JWT token
function createToken(user) {
  return jwt.sign(
    { id: user._id, username: user.name, email: user.email },
    process.env.SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
}

// Function to send token to the client
function sendTokenToClient(user, message, token) {
  return { user, message, token };
}

const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User Already Exists",
      });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ newUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        isError:true,
        message: "Incorrect Password",
      });
    }

    // Generate a token and update user document
    const token = createToken(existingUser);
    existingUser.authToken = token; // Add this line to update the user's authToken
    await existingUser.save();

    // Generate a reset token (if needed)
    // const resetToken = jwt.sign(
    //   { userId: existingUser._id },
    //   process.env.RESET_SECRET_KEY,
    //   {
    //     expiresIn: "1h",
    //   }
    // );

    // Send tokens to the client
    const result = sendTokenToClient(
      existingUser,
      "Login Successful",
      token,
      //resetToken
    );

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
    
module.exports = { signUp, login };
