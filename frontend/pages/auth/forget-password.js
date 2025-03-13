import { useState } from "react";
import { validateEmail } from "../../utils/auth";
import { toast } from "react-toastify";
import Axios from "axios";

const forgetpassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const forgetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const email = e.target.email.value;
    const emailError = validateEmail(email);
    if (emailError !== "") {
      toast.error(emailError);
      setIsLoading(false);
      return;
    }
    try {
      const res = await Axios.post(
        `http://localhost:5001/api/auth/forget-password`,
        {
          email,
        }
      );
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

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
            Reset password to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-4" onSubmit={forgetPassword}>
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email of your account
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your account email"
                  className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default forgetpassword;
