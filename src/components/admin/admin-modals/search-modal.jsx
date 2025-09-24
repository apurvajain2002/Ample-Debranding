import { useState } from "react";
import NormalInputField from "../../input-fields/normal-input-field";
import NormalButton from "../../buttons/normal-button";
import EvuemeModal from "../../modals/evueme-modal";

const SearchModal = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <EvuemeModal
      modalId={"leftNavigationMenuSearchModal"}
      divTagClasses={"flex-start"}
    >
      <NormalInputField
        divTagCssClasses="width-8070"
        inputTagCssClasses="validate fullwidth"
        type="text"
        inputTagIdAndName={"search-query"}
        placeholder={"Search Here..."}
        value={searchValue}
        onChange={(e) => setSearchValue(() => e.target.value)}
      />
      <NormalButton
        buttonTagCssClasses={"btn-search "}
        buttonText={"Search"}
        onClick={() => {}}
      />
    </EvuemeModal>
  );
};

export default SearchModal;
