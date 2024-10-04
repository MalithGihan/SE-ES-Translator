import { validateEmail, validatePassword, validateString ,validateConfirmPassword} from "../ValidationConsraints"

export const validateInput = (inputId, inputValue) => {
    switch (inputId) {
        case 'fullName':
            return inputValue.trim().length > 0 ? true : 'Name is required';
        case 'email':
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
            return emailPattern.test(inputValue) ? true : 'Invalid email format';
        case 'password':
            return inputValue.length >= 6 ? true : 'Password must be at least 6 characters';
        case 'confirmPassword':
            return inputValue.length >= 6 ? true : 'Please confirm your password';
        default:
            return true; // Default case
    }
};
