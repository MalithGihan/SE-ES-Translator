export const reducer = (state, action) => {
  const { validationResult, inputId, inputValue } = action;

  // Update input values with the new input
  const updatedValues = {
    ...state.inputValues,
    [inputId]: inputValue,
  };

  // Update validity states
  const updatedValidities = {
    ...state.inputValidities,
    [inputId]: validationResult, // Assuming validationResult is null for valid inputs
  };

  // Check overall form validity
  let updatedFormIsValid = true;
  for (const key in updatedValidities) {
    // Form is valid only if all fields are valid (validity value should be null)
    if (updatedValidities[key] !== null) {
      updatedFormIsValid = false; // If any field is invalid
      break;
    }
  }

  return {
    inputValues: updatedValues,
    inputValidities: updatedValidities,
    formIsValid: updatedFormIsValid,
  };
};
