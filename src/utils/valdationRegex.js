import WarningToast from "../components/toasts/warning-toast";

export const validateNames = (e) => {
  const char = String.fromCharCode(e.which || e.keyCode);
  const isValid = /^[a-zA-Z ]$/.test(char);

  if (!isValid) {
    e.preventDefault();
  }
};

// export const validateEmailInput = (e) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const inputValue = e.target.value + e.key;
//   if (e.key === " ") {
//     e.preventDefault();
//     return false;
//   }
//   const isValidEmail = emailRegex.test(inputValue);
//   if (!isValidEmail) {
//     e.preventDefault();
//   }
//   return isValidEmail;
// };

export const validateEmailInput = (e, WarningToast) => {
  const inputValue = e.target.value;

  // Condition 1: Check if input is empty ----not working
  if (!inputValue.trim()) {
    e.preventDefault();
    WarningToast("Email cannot be empty!");
    return false;
  }
  if (e.key === " ") {
    e.preventDefault();
    return false;
  }
  // Condition 2: Check for single '@' ---true
  if (inputValue.includes("@") && inputValue.indexOf("@") !== inputValue.lastIndexOf("@")) {
    e.preventDefault();
    WarningToast("Invalid email format: only one '@' is allowed.");
    return false;
  }
  // Condition 4: Check if '@' is at the start ---true
  if (inputValue.startsWith("@")) {
    e.preventDefault();
    WarningToast("Invalid email format");
    return false;
  }
  // Condition 5: Check for domain
  const emailParts = inputValue.split("@");
  if (emailParts.length < 2 || !emailParts[1].includes(".")) {
    e.preventDefault();
    WarningToast("Invalid email format");
    // WarningToast("Invalid email format. Ensure it includes a domain.");
    return false;
  }

  // Condition 4: Check for consecutive dots in the domain
  if (emailParts[1].includes("..")) {
    e.preventDefault();
    WarningToast("Invalid email format: consecutive dots are not allowed.");
    return false;
  }

  // Condition 5: Validate the domain structure
  const domainParts = emailParts[1].split(".");
  if (domainParts.length > 2 || domainParts.some(part => part.length === 0)) {
    e.preventDefault();
    WarningToast("Invalid email format: only one domain is allowed.");
    return false;
  }
  // Regex for valid email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(inputValue);
  if (!isValidEmail) {
    e.preventDefault();
    WarningToast("Invalid email format");
    // WarningToast("Invalid email format. Ensure it includes a valid domain.");
  }
  return isValidEmail;
};



export const validateNumbers = (e) => {
  if (e.target.value.length >= 13) {
    e.preventDefault();
  }
};

export const validatePan = (e, pan) => {
  let panRegex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

  if (pan) {
    if (!panRegex.test("LOOK")) {
      e.preventDefault();
    }
  }
};

export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const checkPasswordStrength = (password = "") => {
  if (password.length < 8) {
    return "Password is too short!";
  } else if (!/[a-zA-Z]/.test(password)) {
    return "Please use at least one alphabet!";
  } else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
    return "Use both uppercase and lowercase letters!";
  } else if (/(\w)\1{3,}/.test(password)) {
    return "No consecutive characters please!";
  }
  return null;
};

const gstinPattern =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

// Validate GSTIN function
export const isvalidGstin = (input) => {
  if (input.length !== 15) {
    return false;
  }
  return gstinPattern.test(input);
};

const cinPattern = /^[LUlu]{1}[0-9]{5}[A-Za-z]{2}[0-9]{4}[A-Za-z]{3}[0-9]{6}$/;

// Validate CIN function
export const isValidCin = (input) => {
  if (input.length !== 21) {
    return false;
  }
  return cinPattern.test(input);
};

// const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export const isValidPan = (input) => {
  if (typeof input !== 'string' || input.length !== 10) {
    return false;
  }
  return panPattern.test(input);
};


const youtubePattern =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&=%\?]{11})$/;
// Validate YouTube URL function
export const isValidYoutubeUrl = (input) => {
  return youtubePattern.test(input);
};

// const linkedinPattern = /^https:\/\/(www\.)?linkedin\.com\/(in|company|jobs\/view)\/[a-zA-Z0-9_-]+\/?$/i;
// // /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub)\/[a-zA-Z0-9_-]+\/?$/;
// // Validate LinkedIn URL function
// export const isValidLinkedinUrl = (input) => {
//   return linkedinPattern.test(input);
// };
export const validateLinkedinUrlInput = (e, WarningToast) => {
  const inputValue = e.target.value;

  // Condition 1: Check if input is empty
  // if (!inputValue.trim()) {
  //   e.preventDefault();
  //   WarningToast("LinkedIn URL cannot be empty!");
  //   return false;
  // }

  // Validate the URL
  // if (!isValidLinkedinUrl(inputValue)) {
  //   e.preventDefault();
  //   WarningToast("Invalid LinkedIn URL format.");
  //   return false;
  // }

  return true; // If valid, allow input
};

const linkedinPattern = /^https:\/\/(www\.)?linkedin\.com\/(in|company|jobs\/view)\/[a-zA-Z0-9_-]+\/?$/i;
export const isValidLinkedinUrl = (input) => {
  return linkedinPattern.test(input);
};


// ===========================FOR COMPANY LINKEDIN URL VALIDATION===============================
export const validateCompanyLinkedinUrlInput = (e, WarningToast) => {
  const inputValue = e.target.value;

  // Condition 1: Check if input is empty
  if (!inputValue.trim()) {
    e.preventDefault();
    WarningToast("LinkedIn URL cannot be empty!");
    return false;
  }

  // Validate the URL
  if (!isValidCompanyLinkedinUrl(inputValue)) {
    e.preventDefault();
    WarningToast("Invalid Company LinkedIn URL format.");
    return false;
  }

  return true; // If valid, allow input
};

const CompanylinkedinPattern = /^https:\/\/(www\.)?linkedin\.com\/company\/[a-zA-Z0-9_-]+\/?$/i;
export const isValidCompanyLinkedinUrl = (input) => {
  return CompanylinkedinPattern.test(input);
};


const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
// Validate hex code function
export const isValidHexCode = (input) => {
  return hexPattern.test(input);
};

export const isValidMobileNumber = (mobileNumber, phoneLength) => {
  if (mobileNumber.length === phoneLength) {
    return true
  }
  return false;
}