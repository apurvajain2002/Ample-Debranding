import React, { useEffect, useState } from "react";
import "flag-icons/css/flag-icons.min.css";
import { getPhoneNumber } from "../../utils/phoneNumberUtils";
// import { isValidPhoneNumber } from "react-phone-number-input";
import { isValidMobileNumber } from "../../utils/valdationRegex";
// import ErrorToast from "../toasts/error-toast";
import WarningToast from "../toasts/warning-toast";

const countries = [
  {
    flag: "fi fi-af",
    code: "AF",
    dialCode: "+93",
    name: "Afghanistan",
    phoneLength: 9,
  },
  {
    flag: "fi fi-al",
    code: "AL",
    dialCode: "+355",
    name: "Albania",
    phoneLength: 8,
  },
  {
    flag: "fi fi-dz",
    code: "DZ",
    dialCode: "+213",
    name: "Algeria",
    phoneLength: 9,
  },
  {
    flag: "fi fi-ad",
    code: "AD",
    dialCode: "+376",
    name: "Andorra",
    phoneLength: 6,
  },
  {
    flag: "fi fi-ao",
    code: "AO",
    dialCode: "+244",
    name: "Angola",
    phoneLength: 9,
  },
  {
    flag: "fi fi-ar",
    code: "AR",
    dialCode: "+54",
    name: "Argentina",
    phoneLength: 10,
  },
  {
    flag: "fi fi-am",
    code: "AM",
    dialCode: "+374",
    name: "Armenia",
    phoneLength: 8,
  },
  {
    flag: "fi fi-au",
    code: "AU",
    dialCode: "+61",
    name: "Australia",
    phoneLength: 9,
  },
  {
    flag: "fi fi-at",
    code: "AT",
    dialCode: "+43",
    name: "Austria",
    phoneLength: 10,
  },
  {
    flag: "fi fi-az",
    code: "AZ",
    dialCode: "+994",
    name: "Azerbaijan",
    phoneLength: 9,
  },
  {
    flag: "fi fi-bh",
    code: "BH",
    dialCode: "+973",
    name: "Bahrain",
    phoneLength: 8,
  },
  {
    flag: "fi fi-bd",
    code: "BD",
    dialCode: "+880",
    name: "Bangladesh",
    phoneLength: 10,
  },
  {
    flag: "fi fi-by",
    code: "BY",
    dialCode: "+375",
    name: "Belarus",
    phoneLength: 9,
  },
  {
    flag: "fi fi-be",
    code: "BE",
    dialCode: "+32",
    name: "Belgium",
    phoneLength: 9,
  },
  {
    flag: "fi fi-br",
    code: "BR",
    dialCode: "+55",
    name: "Brazil",
    phoneLength: 11,
  },
  {
    flag: "fi fi-ca",
    code: "CA",
    dialCode: "+1",
    name: "Canada",
    phoneLength: 10,
  },
  {
    flag: "fi fi-cn",
    code: "CN",
    dialCode: "+86",
    name: "China",
    phoneLength: 11,
  },
  {
    flag: "fi fi-co",
    code: "CO",
    dialCode: "+57",
    name: "Colombia",
    phoneLength: 10,
  },
  {
    flag: "fi fi-dk",
    code: "DK",
    dialCode: "+45",
    name: "Denmark",
    phoneLength: 8,
  },
  {
    flag: "fi fi-eg",
    code: "EG",
    dialCode: "+20",
    name: "Egypt",
    phoneLength: 10,
  },
  {
    flag: "fi fi-fr",
    code: "FR",
    dialCode: "+33",
    name: "France",
    phoneLength: 9,
  },
  {
    flag: "fi fi-de",
    code: "DE",
    dialCode: "+49",
    name: "Germany",
    phoneLength: 11,
  },
  {
    flag: "fi fi-gr",
    code: "GR",
    dialCode: "+30",
    name: "Greece",
    phoneLength: 10,
  },
  {
    flag: "fi fi-hk",
    code: "HK",
    dialCode: "+852",
    name: "Hong Kong",
    phoneLength: 8,
  },
  {
    flag: "fi fi-in",
    code: "IN",
    dialCode: "+91",
    name: "India",
    phoneLength: 10,
  },
  {
    flag: "fi fi-id",
    code: "ID",
    dialCode: "+62",
    name: "Indonesia",
    phoneLength: 10,
  },
  {
    flag: "fi fi-ir",
    code: "IR",
    dialCode: "+98",
    name: "Iran",
    phoneLength: 10,
  },
  {
    flag: "fi fi-iq",
    code: "IQ",
    dialCode: "+964",
    name: "Iraq",
    phoneLength: 10,
  },
  {
    flag: "fi fi-ie",
    code: "IE",
    dialCode: "+353",
    name: "Ireland",
    phoneLength: 10,
  },
  {
    flag: "fi fi-il",
    code: "IL",
    dialCode: "+972",
    name: "Israel",
    phoneLength: 9,
  },
  {
    flag: "fi fi-it",
    code: "IT",
    dialCode: "+39",
    name: "Italy",
    phoneLength: 10,
  },
  {
    flag: "fi fi-jp",
    code: "JP",
    dialCode: "+81",
    name: "Japan",
    phoneLength: 11,
  },
  {
    flag: "fi fi-jo",
    code: "JO",
    dialCode: "+962",
    name: "Jordan",
    phoneLength: 9,
  },
  {
    flag: "fi fi-kz",
    code: "KZ",
    dialCode: "+7",
    name: "Kazakhstan",
    phoneLength: 10,
  },
  {
    flag: "fi fi-ke",
    code: "KE",
    dialCode: "+254",
    name: "Kenya",
    phoneLength: 10,
  },
  {
    flag: "fi fi-kr",
    code: "KR",
    dialCode: "+82",
    name: "South Korea",
    phoneLength: 11,
  },
  {
    flag: "fi fi-kw",
    code: "KW",
    dialCode: "+965",
    name: "Kuwait",
    phoneLength: 8,
  },
  {
    flag: "fi fi-my",
    code: "MY",
    dialCode: "+60",
    name: "Malaysia",
    phoneLength: 10,
  },
  {
    flag: "fi fi-mx",
    code: "MX",
    dialCode: "+52",
    name: "Mexico",
    phoneLength: 10,
  },
  {
    flag: "fi fi-nl",
    code: "NL",
    dialCode: "+31",
    name: "Netherlands",
    phoneLength: 10,
  },
  {
    flag: "fi fi-nz",
    code: "NZ",
    dialCode: "+64",
    name: "New Zealand",
    phoneLength: 10,
  },
  {
    flag: "fi fi-no",
    code: "NO",
    dialCode: "+47",
    name: "Norway",
    phoneLength: 8,
  },
  {
    flag: "fi fi-pk",
    code: "PK",
    dialCode: "+92",
    name: "Pakistan",
    phoneLength: 10,
  },
  {
    flag: "fi fi-ph",
    code: "PH",
    dialCode: "+63",
    name: "Philippines",
    phoneLength: 10,
  },
  {
    flag: "fi fi-pl",
    code: "PL",
    dialCode: "+48",
    name: "Poland",
    phoneLength: 9,
  },
  {
    flag: "fi fi-pt",
    code: "PT",
    dialCode: "+351",
    name: "Portugal",
    phoneLength: 9,
  },
  {
    flag: "fi fi-qa",
    code: "QA",
    dialCode: "+974",
    name: "Qatar",
    phoneLength: 8,
  },
  {
    flag: "fi fi-ru",
    code: "RU",
    dialCode: "+7",
    name: "Russia",
    phoneLength: 10,
  },
  {
    flag: "fi fi-sa",
    code: "SA",
    dialCode: "+966",
    name: "Saudi Arabia",
    phoneLength: 9,
  },
  {
    flag: "fi fi-sg",
    code: "SG",
    dialCode: "+65",
    name: "Singapore",
    phoneLength: 8,
  },
  {
    flag: "fi fi-za",
    code: "ZA",
    dialCode: "+27",
    name: "South Africa",
    phoneLength: 10,
  },
  {
    flag: "fi fi-es",
    code: "ES",
    dialCode: "+34",
    name: "Spain",
    phoneLength: 9,
  },
  {
    flag: "fi fi-se",
    code: "SE",
    dialCode: "+46",
    name: "Sweden",
    phoneLength: 10,
  },
  {
    flag: "fi fi-ch",
    code: "CH",
    dialCode: "+41",
    name: "Switzerland",
    phoneLength: 9,
  },
  {
    flag: "fi fi-tw",
    code: "TW",
    dialCode: "+886",
    name: "Taiwan",
    phoneLength: 10,
  },
  {
    flag: "fi fi-th",
    code: "TH",
    dialCode: "+66",
    name: "Thailand",
    phoneLength: 9,
  },
  {
    flag: "fi fi-tr",
    code: "TR",
    dialCode: "+90",
    name: "Turkey",
    phoneLength: 10,
  },
  {
    flag: "fi fi-ua",
    code: "UA",
    dialCode: "+380",
    name: "Ukraine",
    phoneLength: 9,
  },
  {
    flag: "fi fi-ae",
    code: "AE",
    dialCode: "+971",
    name: "United Arab Emirates",
    phoneLength: 9,
  },
  {
    flag: "fi fi-gb",
    code: "GB",
    dialCode: "+44",
    name: "United Kingdom",
    phoneLength: 10,
  },
  {
    flag: "fi fi-us",
    code: "US",
    dialCode: "+1",
    name: "United States",
    phoneLength: 10,
  },
  {
    flag: "fi fi-vn",
    code: "VN",
    dialCode: "+84",
    name: "Vietnam",
    phoneLength: 10,
  },
];

const DEFAULT_COUNTRY = {
  flag: "fi fi-in",
  code: "IN",
  dialCode: "+91",
  name: "India",
  phoneLength: 10,
};

const MobileNumberInputField2 = ({
  value = "",
  countryCode,
  setCountryCode,
  onChange = () => {},
  setMobileNumberEnabled = () => {},
  showDropdownBelow = true,
}) => {
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(getPhoneNumber(value));
  const [touched, setTouched] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setCountryCode(selectedCountry.dialCode);
    setMobileNumber(""); // Clear the mobile number
    setIsDropdownOpen(false);
  };

  // const onNumberChange=(e)=>{
  //   setMobileNumber(e.target.value)
  //   setCountryCode(selectedCountry.dialCode)
  // }

  const onNumberChange = (e) => {
    const input = e.target.value;
    setTouched(true); // Mark as touched on any change
    if (input.length <= selectedCountry.phoneLength) {
      setMobileNumber(input);
    }
  };

  const setNumber = (e) => {
    const number = selectedCountry.dialCode + mobileNumber;
    if (
      touched && // Only validate if touched
      mobileNumber !== "" &&
      !isValidMobileNumber(mobileNumber, selectedCountry.phoneLength)
    ) {
      WarningToast("Please Enter Valid Mobile Number");
      onChange(selectedCountry.dialCode + "");
      return;
    }
    setCountryCode(selectedCountry.dialCode);
    onChange(number);
  };

  useEffect(() => {
    setMobileNumberEnabled(
      isValidMobileNumber(mobileNumber, selectedCountry.phoneLength)
    );
  }, [mobileNumber]);

  return (
    <div className="phone-input-container">
      <div className="phone-input-wrapper">
        <button
          onClick={toggleDropdown}
          type="button"
          className="country-selector"
        >
          <span
            className={selectedCountry.flag}
            style={{ marginRight: "10px" }}
          ></span>
          <span className="country-code">{selectedCountry.code}</span>
          <span className="dial-code">{selectedCountry.dialCode}</span>
          <span className="dropdown-arrow">▼</span>
        </button>
        <input
          type="number"
          placeholder="Enter Mobile Number"
          className="phone-input"
          value={mobileNumber}
          onKeyDown={(evt) =>
            ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()
          }
          onChange={onNumberChange}
          onBlur={setNumber}
          style={{ width: "100px", backgroundColor: "white" }}
        />
      </div>

      {isDropdownOpen && (
        <div
          className="country-dropdown"
          style={
            !showDropdownBelow
              ? { bottom: "100%", top: "auto" }
              : { top: "100%", bottom: "auto" }
          }
        >
          {countries.map((country) => (
            <div
              key={country.code}
              className="country-option"
              onClick={() => selectCountry(country)}
            >
              <span className={country.flag}></span>
              <span className="country-name">{country.name}</span>
              <span className="dial-code">{country.dialCode}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileNumberInputField2;
