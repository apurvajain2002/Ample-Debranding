import { useEffect, useState } from "react";
import NormalInputField from "../../components/input-fields/normal-input-field";
import NormalButton from "../../components/buttons/normal-button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  editIndustry as editIndustries,
  getIndustryInfo,
} from "../../redux/actions/industry-actions/industry-actions";
import { useDispatch, useSelector } from "react-redux";
import { setSearchValue } from "../../redux/slices/industry-slice";

const EditIndustry = () => {
  const { industryId } = useParams();
  const { state } = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { successMessage } = useSelector((state) => state.industrySliceReducer);
  const [editIndustry, setEditIndustry] = useState({
    newIndustryName: "",
    newIndustryDescription: "",
  });

  // Handle onChange
  const handleOnChange = (e) => {
    const inputValue = e.target.value;
    setEditIndustry((prevData) => ({
      ...prevData,
      [e.target.name]: inputValue,
    }));
  };

  // Handle Edit Industry
  const handleEditIndustry = async () => {
    dispatch(
      editIndustries({
        industryId,
        newIndustryName: editIndustry.newIndustryName,
        newIndustryDescription: editIndustry.newIndustryDescription,
      })
    );
  };

  // Handle cancel edit button
  const handleOnCancelButton = () => {
    setEditIndustry(() => ({
      newIndustryName: "",
      newIndustryDescription: "",
    }));
    return navigate("/admin/industry");
  };

  // Handle if the industry exists in DB
  const handleGetIndustryInfo = () => {
    dispatch(getIndustryInfo({ industryId }));
  };

  useEffect(() => {
    setEditIndustry((prevState) => ({
      ...prevState,
      newIndustryName: state?.name || "",
      newIndustryDescription: state?.description || "",
    }));
    if (!industryId || industryId === "") {
      navigate("/admin/industry");
    } else {
      handleGetIndustryInfo();
    }
  }, [industryId]);

  useEffect(() => {
    if (successMessage) {
      setEditIndustry(() => ({
        newIndustryName: "",
        newIndustryDescription: "",
      }));
      dispatch(setSearchValue(""));
      navigate("/admin/industry");
    }
  }, [successMessage]);

  return (
    <>
      <h3>Edit Industry</h3>
      <div className="row createEditMaster">
        <div className="valign-wrapper createEditMasterLeft col xl12 l12 m12 s12">
          <NormalInputField
            divTagCssClasses="input-field col xl3 l3 m6 s12"
            type="text"
            inputTagIdAndName={"newIndustryName"}
            placeholder={"New Industry name"}
            value={editIndustry.newIndustryName}
            onChange={(e) => handleOnChange(e)}
            labelText={"Industry Name"}
          />
          <NormalInputField
            divTagCssClasses="input-field col xl6 l6 m12 s12"
            type="text"
            inputTagIdAndName={"newIndustryDescription"}
            placeholder={"New Industry Description"}
            value={editIndustry.newIndustryDescription}
            onChange={(e) => handleOnChange(e)}
            labelText={"Industry Description"}
          />
          <div className="col xl3 l3 m12 s12 large-screen-start-small-screen-center ">
            <NormalButton
              buttonTagCssClasses={"btn-clear margin-right-5"}
              buttonText={"Update"}
              onClick={handleEditIndustry}
            />
            <NormalButton
              buttonTagCssClasses={"btn-submit btn-clear "}
              buttonText={"Cancel"}
              onClick={handleOnCancelButton}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditIndustry;
