const validate = (e, setError) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const name = formData.get("name");
  const mobile = formData.get("phone");
  const email = formData.get("email");
  const address = formData.get("address");
  const password = formData.get("password");
  const passwordConfirm = formData.get("passwordConfirm");

  let errorObj = {};

  const emailError = validateEmail(email);
  if (emailError != "") {
    errorObj.email = emailError;
  }

  const passwordError = validatePassword(password);
  if (Object.keys(passwordError).length > 0) {
    errorObj.password = passwordError;
  }

  const phoneError = validatePhone(mobile);
  if (phoneError != "") {
    errorObj.phone = phoneError;
  }

  const nameError = validateName(name);
  if (nameError != "") {
    errorObj.name = nameError;
  }

  const confirmPasswordError = validateConfirmPassword(
    password,
    passwordConfirm
  );
  if (confirmPasswordError != "") {
    errorObj.passwordConfirm = confirmPasswordError;
  }

  if (Object.keys(errorObj).length > 0) {
    setError(errorObj);
    return;
  }

  setError({});
  const formObject = {
    name,
    phone: mobile,
    email,
    address,
    password,
  };
  return formObject;
};

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (email.length === 0) {
    return "Email is required";
  }
  if (!emailRegex.test(email)) {
    return "Invalid email address";
  }
  return "";
};

const validatePassword = (password) => {
  let passwordError = {};
  const allowedSpecialCharacters = /[!@#$%^&*\-+?]+/;

  if (password.length === 0) {
    passwordError = { ...passwordError, main: "Password is required" };
    return passwordError;
  }
  if (password.length < 8) {
    passwordError = {
      ...passwordError,
      len: "Password must be atleast 8 characters long",
    };
  }
  if (!/[a-zA-Z]/.test(password)) {
    passwordError = {
      ...passwordError,
      letter: "Password must contain a letter",
    };
  }
  if (!/\d/.test(password)) {
    passwordError = {
      ...passwordError,
      number: "Password must contain a number",
    };
  }
  if (
    !allowedSpecialCharacters.test(password) ||
    /[^a-zA-Z0-9!@#$%^&*\-+?]/.test(password)
  ) {
    passwordError = {
      ...passwordError,
      special: "Password must contain a special character",
    };
  }
  return passwordError;
};

const validatePhone = (phone) => {
  if (phone.length === 0) {
    return "Phone number is required";
  }
  return "";
};

const validateName = (name) => {
  if (name.length === 0) {
    return "Name is required";
  }
  return "";
};

const validateConfirmPassword = (password, passwordConfirm) => {
  if (password !== passwordConfirm) {
    return "Password and confirm password do not match";
  }
  return "";
};

export {
  validate,
  validateEmail,
  validatePassword,
  validatePhone,
  validateName,
  validateConfirmPassword,
};
