import React, { useState } from "react";
import { searchedCandidateList } from "../../redux/slices/interview-responses-l1-dashboard-slice";
import { useDispatch } from "react-redux";

const SearchInput = ({
  searchIcon,
  placeholder,
  searchText,
  handleSearchChange,
}) => {
  return (
    <div className="si-parent-container">
      <input
        type="text"
        placeholder={placeholder}
        value={searchText}
        onChange={handleSearchChange}
        className="si-inputbox"
      />
      <img
        src={searchIcon}
        alt="Search Icon"
        style={{
          position: "absolute",
          right: "5px",
          top: "59%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          width: "40px",
          height: "40px",
        }}
      />
    </div>
  );
};

export default SearchInput;
