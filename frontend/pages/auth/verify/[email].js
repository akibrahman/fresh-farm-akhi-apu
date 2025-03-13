import React, { useState } from "react";
import Axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const verify = () => {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);

  const { email } = router.query;

  const verifyAccount = async (e) => {
    e.preventDefault();
    setIsVerifying(true);

    const otp = e.target.otp.value;
    if (otp.length == 0) {
      toast.error("Please provide the OTP!");
      setIsVerifying(false);
      return;
    }

    try {
      const res = await Axios.post(
        `http://localhost:5001/api/auth/verify/${email}`,
        {
          otp,
        }
      );
      toast.success("Account verified successfully. You can now login!");
      if (res.data.status === "success") {
        router.push("/login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOTP = async () => {
    setIsVerifying(true);
    try {
      const res = await Axios.get(
        `http://localhost:5001/api/auth/verify/${email}`
      );

      toast.success("A new otp has been sent. Check your email");
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div style={{ cursor: isVerifying ? "wait" : "default" }}>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://freepnglogo.com/images/all_img/1691819865alight-motion-logo-transparent.png"
            alt="elevateMart logo"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Verify your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-4" onSubmit={verifyAccount}>
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                One Time Password
              </label>
              <div className="mt-2">
                <input
                  id="otp"
                  name="otp"
                  type="string"
                  placeholder="Enter your otp from email"
                  className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Verify
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Didn't receive an OTP? &nbsp;
            <a
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 hover:cursor-pointer"
              onClick={resendOTP}
            >
              Resend OTP
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default verify;
