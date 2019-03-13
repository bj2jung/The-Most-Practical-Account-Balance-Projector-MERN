const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.userId = !isEmpty(data.userId) ? data.userId : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // userId checks
  if (validator.isEmpty(data.userId)) {
    errors.userId = "User Id field is required";
  }

  // Password checks
  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
