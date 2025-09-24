import { useEffect, useState } from "react";
import NormalInputField from "../../components/input-fields/normal-input-field";
import NormalButton from "../../components/buttons/normal-button";
import { useDispatch, useSelector } from "react-redux";
import { createIndustry } from "../../redux/actions/industry-actions/industry-actions";
import { setSearchValue } from "../../redux/slices/industry-slice";
import WarningToast from "../../components/toasts/warning-toast";

const intialIndustryObject = {
  industryName: "",
  industryDescription: "",
};

const CreateIndustry = () => {
  const [newIndustry, setNewIndustry] = useState(intialIndustryObject);

  const dispatch = useDispatch();
  const { successMessage } = useSelector((state) => state.industrySliceReducer);

  const handleOnChange = (e) => {
    const inputValue = e.target.value;
    setNewIndustry((prevData) => ({
      ...prevData,
      [e.target.name]: inputValue,
    }));
  };

  // Handle create industry function
  const handleCreateIndustry = () => {
    if (!newIndustry.industryName || newIndustry.industryName === "") {
      return WarningToast("Please enter the required fields!");
    }
    dispatch(
      createIndustry({
        industryName: newIndustry.industryName,
        industryDescription: newIndustry.industryDescription,
      })
    );
    dispatch(setSearchValue(""));
  };

  useEffect(() => {
    if (successMessage) {
      setNewIndustry(() => ({
        industryName: "",
        industryDescription: "",
      }));
    }
  }, [successMessage]);

  return (
    <>
      <h3>Create Industry</h3>
      <div className="row createEditMaster">
        <div className="valign-wrapper createEditMasterLeft col s12">
          <NormalInputField
            divTagCssClasses="input-field col xl3 l3 m3 s12"
            inputTagCssClasses="validate"
            type="text"
            inputTagIdAndName={"industryName"}
            placeholder={"Industry Name"}
            value={newIndustry.industryName}
            onChange={(e) => handleOnChange(e)}
            labelText={"Industry Name"}
            required={true}
          />
          <NormalInputField
            divTagCssClasses="input-field col xl7 l7 m7 s12"
            type="text"
            inputTagIdAndName={"industryDescription"}
            placeholder={"Industry Description"}
            value={newIndustry.industryDescription}
            onChange={(e) => handleOnChange(e)}
            labelText={"Industry Description"}
          />
          <div className="col xl2 l2 m8 s12 large-screen-start-small-screen-center">
            <NormalButton
              buttonTagCssClasses={"btn-submit btn-clear "}
              buttonText={"Create"}
              onClick={handleCreateIndustry}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateIndustry;
