import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import createOTP from "../utils/generateOTP.js";
import { sendPasswordResetEmail, sendOTPEmail } from "../utils/emailSender.js";
import { encrypt, decryptEmail } from "../utils/textCipher.js";
import OTP from "../models/otpModel.js";
import generateToken from "../utils/generateToken.js";

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password!");
  }

  const existingUser = await User.findOne({ email }).select(
    "+password +isAdmin"
  );

  if (!existingUser) {
    res.status(401);
    throw new Error("Invalid email or password!");
  }

  const isValid = await existingUser.matchPassword(password);

  if (!isValid) {
    res.status(401);
    throw new Error("Invalid email or password!");
  }

  if (!existingUser.isVerified) {
    res.status(401);
    throw new Error("Please verify your email to login!");
  }

  const token = generateToken(res, existingUser._id, existingUser.isAdmin);

  res.status(200).json({
    status: "success",
    message: "Login successful",
    token,
  });
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, address, password } = req.body;

  if (!name || !email || !phone || !password) {
    res.status(400);
    throw new Error("Please fill in name, email, password and phone fields!");
  }

  const prevUser = await User.findOne({ email });
  if (prevUser) {
    res.status(400);
    throw new Error("User already exists! Please login to continue.");
  }

  const otp = await createOTP(email, "verify");

  const user = await User.create({
    name,
    email,
    phone,
    address,
    password,
  });

  const encryptedEmail = encrypt(email);
  const hashedEmail = encryptedEmail.encryptedData + "-" + encryptedEmail.iv;

  const verifyURL = `${process.env.FRONTEND_URL}/auth/verify/${hashedEmail}`;

  await sendOTPEmail(user, otp, verifyURL);

  res.status(201).json({
    status: "success",
    message: "User created successfully. Please verify your email!",
    data: {
      url: verifyURL,
    },
  });
});

// @desc   Verify a user
// @route  POST /api/auth/verify/:email
// @access Public
const verifyUser = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    res.status(400);
    throw new Error("Please provide the OTP!");
  }

  const email = decryptEmail(req.params.email);

  const user = await User.findOne({
    email,
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid Token. No user found with this token!");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("User already verified");
  }

  const otpRecord = await OTP.findOne({
    email,
    active: true,
  });

  const isMatch = await otpRecord.isCorrect(otp.toString().trim());
  if (!otpRecord || !isMatch) {
    res.status(400);
    throw new Error("Invalid OTP. Please try again!");
  }

  const isExpired = otpRecord.isExpired();
  if (isExpired) {
    res.status(400);
    throw new Error("OTP has expired. Please request a new OTP!");
  }

  user.isVerified = true;
  await user.save();

  await OTP.findByIdAndDelete(otpRecord._id);

  res.status(201).json({
    status: "success",
    message:
      "Welcome to FarmFresh! Your account has been verified successfully!",
  });
});

// @desc   Request a new OTP
// @route  GET /api/auth/:email
// @access Public
const requestOTP = asyncHandler(async (req, res) => {
  const email = decryptEmail(req.params.email);

  const user = await User.findOne({
    email,
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid Token. No user found with this token!");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("User already verified");
  }

  const activeOTP = await OTP.findOne({
    email,
    active: true,
  });

  if (activeOTP) {
    console.log("Deleting=======================");
    await OTP.deleteOne({ _id: activeOTP._id });
  }

  const newOtp = await createOTP(email, "verify");

  const verifyURL = `${process.env.FRONTEND_URL}/auth/verify/${req.params.email}`;
  await sendOTPEmail(user, newOtp, verifyURL);

  res.status(201).json({
    status: "success",
    message: "OTP sent successfully",
  });
});

// @desc   Forget Password
// @route  POST /api/auth/forget-password
// @access Public
const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    res.status(400);
    throw new Error("User not found! Please register to continue.");
  }

  const otp = await createOTP(email, "reset");

  const encryptedEmail = encrypt(email);
  const hashedEmail = encryptedEmail.encryptedData + "-" + encryptedEmail.iv;

  const resetURL = `${process.env.FRONTEND_URL}/auth/reset-password/${hashedEmail}/${otp}`;

  await sendPasswordResetEmail(existingUser, resetURL);

  res.status(201).json({
    status: "success",
    message: "OTP sent successfully. Please check your email!",
  });
});

// @desc   Reset Password request verification
// @route  GET /api/auth/reset-password/:email/:otp
// @access Public
const verifyResetPasswordRequest = asyncHandler(async (req, res) => {
  const { email, token } = req.params;

  const decryptedEmail = decryptEmail(email);

  const existingUser = await User.findOne({ email: decryptedEmail });

  const otpRecord = await OTP.findOne({
    email: decryptedEmail,
    active: true,
  });

  if (!existingUser || !otpRecord) {
    res.status(400);
    throw new Error("Invalid OTP. Please try again!");
  }

  const isMatch = otpRecord.isCorrect(token);

  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid OTP. Please try again!");
  }

  const isExpired = otpRecord.isExpired();

  if (isExpired) {
    res.status(400);
    throw new Error("OTP has expired. Please request a new OTP!");
  }

  await OTP.findByIdAndDelete(otpRecord._id);

  res.status(201).json({
    status: "success",
    message: "OTP verified successfully. You can reset your password now!",
  });
});

// @desc   Reset Password
// @route  POST /api/auth/reset-password/:email/
// @access Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const { password } = req.body;

  const decryptedEmail = decryptEmail(email);

  const existingUser = await User.findOne({ email: decryptedEmail });

  if (!existingUser) {
    res.status(400);
    throw new Error("User not found! Please register to continue.");
  }

  existingUser.password = password;
  await existingUser.save();

  res.status(201).json({
    status: "success",
    message: "Password reset successfully. Please login to continue!",
  });
});

// @desc   logout
// @route  POST /api/auth/logout
// @access Public
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("jwt");

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

export {
  login,
  logout,
  verifyUser,
  requestOTP,
  registerUser,
  forgetPassword,
  resetPassword,
  verifyResetPasswordRequest,
};
