import OTP from "../models/otpModel.js";
import crypto from "crypto";

function generateSecureOTP(otpFor) {
  const randomBuffer = crypto.randomBytes(4);
  const randomNumber = randomBuffer.readUInt32BE(0);
  const dateTimeNow = new Date().toISOString();

  const otpLength = otpFor === "verify" ? 6 : 32;

  const hash = crypto
    .createHash("sha256")
    .update(`${randomNumber}${dateTimeNow}`)
    .digest("hex");

  if (otpFor === "verify") {
    const otpPortion = hash.substring(0, otpLength);
    const otp = (parseInt(otpPortion, 16) % 900000) + 100000;
    return otp.toString().substring(0, otpLength);
  }
  return hash.substring(0, otpLength);
}

const createOTP = async (email, otpFor) => {
  const otp = generateSecureOTP(otpFor);
  const minutes =
    otpFor === "verify"
      ? process.env.VERIFY_OTP_VALIDITY
      : process.env.RESET_OTP_VALIDITY;
  const duration = parseInt(minutes) * 60 * 1000;

  await OTP.create({
    otp,
    email,
    validTo: new Date(Date.now() + duration),
    useFor: otpFor,
  });
  return otp;
};

export default createOTP;
