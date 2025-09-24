import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { icon, image } from "../assets/assets";
import SearchInput from "../input-fields/search-input-field";
import { searchedCandidateList } from "../../redux/slices/interview-responses-l1-dashboard-slice";
import CandidateProfile from "../interview-responses/candidate-profile";
import CustomClockLoader from "../loaders/clock-loader";

const CandidateListWidget = ({
  candidateList,
  handleSelectApplicant,
  fetchingCandidateList,
}) => {
  const dispatch = useDispatch();
  const sortingOptions = [
    {
      optionKey: "Descending Order",
      optionValue: "descending_order",
    },
    {
      optionKey: "Ascending Order",
      optionValue: "ascending_order",
    },
  ];

  const [selectedOrder, setSelectedOrder] = useState("");
  const [searchText, setSearchText] = useState("");

  const handleOnChange = (event) => {
    const selectedOrder = event.target.value;
    setSelectedOrder(selectedOrder);

    // Dispatch the search and sort action
    dispatch(
      searchedCandidateList({
        searchTerm: searchText,
        sortOrder: selectedOrder,
      })
    );
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearchText(searchTerm);

    dispatch(
      searchedCandidateList({
        searchTerm,
        sortOrder: selectedOrder,
      })
    );
  };

  return (
    <div className="clw-container">
      {fetchingCandidateList ? (
        <div
          className="clw-cand-boxscrollwr"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CustomClockLoader size={26} />
        </div>
      ) : (
        <div>
          <div className="clw-input-boxes">
            <select
              id="sortByScore"
              name="sortByScore"
              required
              value={selectedOrder}
              onChange={handleOnChange}
            >
              <option value="" disabled>
                Select Sort Order
              </option>
              {sortingOptions.map((option) => (
                <option key={option.optionValue} value={option.optionValue}>
                  {option.optionKey}
                </option>
              ))}
            </select>
            {/* Search Input */}
            <div className="center-items">
              <SearchInput
                searchIcon={icon.searchIcon}
                placeholder={"Candidate Name"}
                searchText={searchText}
                handleSearchChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="clw-cand-boxscrollwr">
            {candidateList.length > 0 ? (
              <ul className="clw-cand-ul" style={{ width: "100%" }}>
                {candidateList.map((candidate, index) => (
                  <li
                    key={candidate.id || index} // Ensure stable, unique keys
                    onClick={() => handleSelectApplicant(candidate.id)}
                    tabIndex={0}
                    className="clw-cand-item"
                  >
                    <CandidateProfile
                      name={`${candidate.firstName} ${candidate.lastName}`}
                      imgSrc={image.userProfileImage}
                      // score={candidate.aiScore}
                      // status={candidate.status}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                No data available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateListWidget;
