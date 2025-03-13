import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Axios from "axios";
import { HashLoader } from "react-spinners";
import { FaEye } from "react-icons/fa";
import { IoEyeOffSharp } from "react-icons/io5";
import { validatePassword } from "@/utils/auth";

const resetPassword = () => {
  const router = useRouter();
  const { email, token } = router.query;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verifySuccessful, setVerifySuccessful] = useState(false);

  const onShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onShowConfirmPass = () => {
    setShowConfirmPass(!showConfirmPass);
  };

  useEffect(() => {
    const resetURL = `http://localhost:5001/api/auth/reset-password/${email}/${token}`;

    async function isValidToken() {
      if (!email || !token) {
        return;
      }

      setIsLoading(true);
      try {
        const res = await Axios.get(resetURL, {
          email,
          token,
        });
        if (res.data.status === "success") {
          setVerifySuccessful(true);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
      } finally {
        setIsLoading(false);
      }
    }
    isValidToken();
  }, [email]);

  const resetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const password = e.target.password.value;
    const confirmPassword = e.target.passwordConfirm.value;
    const valPass = validatePassword(password);

    if (Object.keys(valPass).length > 0) {
      const msg = Object.values(valPass).join("\n");
      toast.error(msg);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const res = await Axios.post(
        `http://localhost:5001/api/auth/reset-password/${email}`,
        {
          password,
          token,
        }
      );
      toast.success(res.data.message);
      router.push("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading === true) {
    return (
      <div className="mx-auto my-auto">
        <HashLoader color="#00a697" loading size={260} speedMultiplier={1} />
      </div>
    );
  }

  if (verifySuccessful === false) {
    return (
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Invalid request! Please try again.
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ cursor: isLoading ? "wait" : "default" }}>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://freepnglogo.com/images/all_img/1691819865alight-motion-logo-transparent.png"
            alt="elevateMart logo"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Reset your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-4" onSubmit={resetPassword}>
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
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Reset your password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default resetPassword;
