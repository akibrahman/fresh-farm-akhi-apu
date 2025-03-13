import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";

// @desc    Get user profile
// @route   GET /api/users
// @access  Protected
const getProfile = asyncHandler(async (req, res) => {
  const { email } = req.user;

  const profile = await User.findOne({ email });
  if (!profile) {
    throw new Error("Profile not found");
  }
  res.status(200).json(profile);
});

// @desc    Edit user profile
// @route   PUT /api/users
// @access  Protected
const updateProfile = asyncHandler(async (req, res) => {
  const { email, phone, address, name, image } = req.body;

  const profile = await User.findOne({ email });
  if (!profile) {
    throw new Error("Profile not found");
  }

  if (profile._id.toString() !== req.user._id.toString()) {
    throw new Error("You are not authorized to update this profile");
  }

  const newProfileData = await User.findByIdAndUpdate(
    profile._id,
    {
      name,
      phone,
      address,
      profilePicture: image,
    },
    { new: true }
  );

  res.status(200).json(newProfileData);
});

// @desc    get all users
// @route   get /api/users/allUsers
// @access  Protected
const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await User.find({}).sort({ isAdmin: -1 });
  res.status(200).json(allUsers);
});

// @desc    Promoted user
// @route   PUT /api/users/:id
// @access  Protected

const userPromote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const profile = await User.findOne({ _id: id });
  if (!profile) {
    throw new Error("Profile not found");
  }

  profile.isAdmin = true;
  await profile.save();

  res.status(200).json({
    status: "success",
    message: "User successfully promoted to Admin",
  });
});

// @desc    delete a user
// @route   PUT /api/users/:id
// @access  Protected

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const profile = await User.findOne({ _id: id });
  if (!profile) {
    throw new Error("Profile not found");
  }

  if (id === req.user._id.toString()) {
    throw new Error("User cannot delete himself");
  }

  await Order.deleteMany({
    orderBy: id,
  });
  await User.deleteOne({ _id: id });

  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
});

export { getProfile, updateProfile, userPromote, getAllUsers, deleteUser };
