import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const otpSchema = new mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    validTo: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    useFor: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

otpSchema.methods.isExpired = function () {
  return Date.now() > this.validTo;
};

otpSchema.methods.isCorrect = function (otp) {
  return bcrypt.compareSync(otp, this.otp);
};

otpSchema.pre("save", function (next) {
  if (!this.isModified("otp")) {
    return next();
  }
  const salt = bcrypt.genSaltSync(8);
  this.otp = bcrypt.hashSync(this.otp, salt);
  next();
});

const OTP = mongoose.model("otps", otpSchema);

export default OTP;
