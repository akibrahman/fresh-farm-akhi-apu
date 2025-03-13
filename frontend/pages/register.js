import Axios from "axios";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { IoEyeOffSharp } from "react-icons/io5";
import { validate } from "../utils/auth.js";
import { toastManager } from "@/utils/toastManager.js";

const register = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState({});

  const onShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onShowConfirmPass = () => {
    setShowConfirmPass(!showConfirmPass);
  };

  async function handleSubmit(e) {
    setIsVerifying(true);
    e.preventDefault();
    const form = e.target;
    const formObject = validate(e, setError);
    if (!formObject) {
      return;
    }
    const toastId = toastManager.loading("Registering...");
    const reqURL = "http://localhost:5001/api/auth/register";
    try {
      const res = await Axios.post(reqURL, formObject);
      form.reset();
      const { url } = res.data.data;
      toastManager.updateStatus(toastId, {
        render: "Registered successfully",
        type: "success",
      });

      setTimeout(() => {
        router.push(url);
      }, 2000);
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      toastManager.updateStatus(toastId, {
        render: message,
        type: "error",
      });
    } finally {
      setIsVerifying(false);
    }
  }

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
            Sign up to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="string"
                  autoComplete="full-name"
                  placeholder="Enter your full name"
                  className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6 focus:outline-none"
                />
              </div>

              {error?.name && (
                <div className="px-4 py-2 text-xs text-red-800 rounded-lg bg-red-50">
                  Full name is required!
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6 focus:outline-none"
                />
              </div>
              {error?.email && (
                <div className="px-4 py-2 text-xs text-red-800 rounded-lg bg-red-50">
                  {error.email}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <div className="flex justify-between items-center px-3  w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="password"
                    placeholder="Enter a password"
                    className="block focus:ring-transparent focus:outline-none w-full"
                  />
                  <div onClick={onShowPassword}>
                    {showPassword ? <FaEye /> : <IoEyeOffSharp />}
                  </div>
                </div>
                {error?.password && Object.keys(error.password).length > 0 && (
                  <div className="px-4 py-2 text-xs text-red-800 rounded-lg bg-red-50">
                    <ul className="list-disc list-inside">
                      {Object.values(error.password).map((err, index) => (
                        <li key={index} className="px-2">
                          {err}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password Confirm
              </label>
              <div className="mt-2">
                <div className="flex justify-between items-center px-3  w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6">
                  <input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type={showConfirmPass ? "text" : "password"}
                    autoComplete="password"
                    placeholder="Enter a password"
                    className="block focus:ring-transparent focus:outline-none w-full"
                  />
                  <div onClick={onShowConfirmPass}>
                    {showConfirmPass ? <FaEye /> : <IoEyeOffSharp />}
                  </div>
                </div>
                {error?.passwordConfirm && (
                  <div className="px-4 py-2 text-xs text-red-800 rounded-lg bg-red-50">
                    Password and confirm password do not match.
                  </div>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Phone Number
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="string"
                  autoComplete="mobile-number"
                  placeholder="Enter your your mobile number"
                  className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6 focus:outline-none"
                />
              </div>
              {error?.phone && (
                <div className="px-4 py-2 text-xs text-red-800 rounded-lg bg-red-50">
                  Phone number is required!
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Address
              </label>
              <div className="mt-2">
                <input
                  id="address"
                  name="address"
                  type="address"
                  autoComplete="address"
                  placeholder="Enter your address"
                  className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account? &nbsp;
            <a
              href="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default register;
