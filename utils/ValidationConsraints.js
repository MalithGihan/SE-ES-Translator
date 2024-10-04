import validate from 'validate.js';

export const validateString = (id, value) => {
    const constraints = {
      presence: {
        allowEmpty: false,
        message: "This field is required"
      },
      format: {
        pattern: ".+",
        flags: "i",
        message: "Value can't be blank."
      }
    };
  
    const validationResult = validate({ [id]: value }, { [id]: constraints });
    return validationResult ? validationResult[id] : null; // Return null if valid
  };
  
  export const validateEmail = (id, value) => {
    const constraints = {
      presence: {
        allowEmpty: false,
        message: "Email is required"
      },
      email: {
        message: "Enter a valid email address"
      }
    };
  
    const validationResult = validate({ [id]: value }, { [id]: constraints });
    return validationResult ? validationResult[id] : null; // Return null if valid
  };
  
  export const validatePassword = (id, value) => {
    const constraints = {
      presence: {
        allowEmpty: false,
        message: "Password is required"
      },
      length: {
        minimum: 6,
        message: "Password must be at least 6 characters"
      }
    };
  
    const validationResult = validate({ [id]: value }, { [id]: constraints });
    return validationResult ? validationResult[id] : null; 
  };

  export const validateConfirmPassword = (password, confirmPassword) => {
  const constraints = {
    presence: {
      allowEmpty: false,
      message: "Confirm Password is required"
    },
    equality: {
      attribute: "password",
      message: "Passwords do not match"
    }
  };

  const validationResult = validate(
    { confirmPassword, password },
    { confirmPassword: constraints }
  );

  return validationResult ? validationResult.confirmPassword : null; 
};
  