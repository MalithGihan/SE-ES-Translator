import { validateEmail, validatePassword, validateString } from "../ValidationConsraints"

export const validateInput = (inputId, inputValue) => {
    if(inputId === "fullName"){
        return validateString(inputId,inputValue)
    } else if (inputId==="email"){
        return validateEmail(inputId,inputValue)
    }else if (inputId === "password" || inputId === "passwordConfirm"){
        return validatePassword(inputId,inputValue)
    }
}