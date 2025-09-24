import { parsePhoneNumber } from "react-phone-number-input";

export const getCountryCode = (mobileNumber) => {
  // if(mobileNumber <= 5) return "";
  if(mobileNumber=== null || mobileNumber === undefined || mobileNumber === "") return "";
  const phoneNumber = parsePhoneNumber(mobileNumber);
  if(phoneNumber===undefined){
    return ""
  }
  const countryCode = phoneNumber.countryCallingCode;
  return countryCode;
};

export const getPhoneNumber = (mobileNumber) => {
  if(!mobileNumber) return "";
  const phoneNumber = parsePhoneNumber(mobileNumber);
  if(phoneNumber===undefined){
    return ""
  }
  const nationalNumber = phoneNumber.nationalNumber;
  return nationalNumber;
};
