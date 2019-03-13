const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.userId = !isEmpty(data.userId) ? data.userId : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // userId checks
  if (validator.isEmpty(data.userId)) {
    errors.userId = "User Id field is required";
  }

  // Password checks
  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }
  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }
  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
