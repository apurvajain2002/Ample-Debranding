import { useEffect, useState } from "react";
import NormalInputField from "../../components/input-fields/normal-input-field";
import NormalButton from "../../components/buttons/normal-button";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchValue } from "../../redux/slices/industry-slice";
import { editLocation } from "../../redux/actions/location-actions/location-actions";
import { icon } from "../../components/assets/assets";
import SuccessToast from "../../components/toasts/success-toast";
import ErrorToast from "../../components/toasts/error-toast";
import EvuemeLoader from "../../components/loaders/evueme-loader";
import getUniqueId from "../../utils/getUniqueId";

const EditLocation = ({ handleGetAllIndustries }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const {
    loading,
    getIndustryInfoLoading,
    editIndustryFailMessage,
    editIndustrySuccessMessage,
  } = useSelector((state) => state.manageLocationsSliceReducer);
  const [editIndustry, setEditIndustry] = useState({
    newIndustryName: "",
    newIndustryDescription: "",
  });

  const [location, setLocation] = useState({
    address: state.address,
  });
  const [inputs, setInputs] = useState([""]);

  useEffect(() => {
    setLocation({ address: state.address });
    setInputs(state.address);
  }, [state]);

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
    setLocation({ address: newInputs });
  };

  // Handle Edit Role
  const handleEditIndustry = () => {
    dispatch(
      editLocation({
        countryName: state.countryName,
        stateName: state.stateName,
        cityName: state.cityName,
        address: location.address,
      })
    );
    dispatch(setSearchValue(""));
  };

  // Handle cancel edit button
  const handleOnCancelButton = () => {
    setEditIndustry(() => ({
      newIndustryName: "",
      newIndustryDescription: "",
    }));
    return navigate("/admin/location");
  };

  const handleRemove = (index) => {
    const currentInputs = [...inputs];
    currentInputs.splice(index, 1);
    setInputs(currentInputs);
    setLocation({ ...location, address: currentInputs });
  };

  useEffect(() => {
    if (editIndustrySuccessMessage) {
      SuccessToast(editIndustrySuccessMessage);
      handleGetAllIndustries();
      setEditIndustry(() => ({
        newIndustryName: "",
        newIndustryDescription: "",
      }));
    } else if (editIndustryFailMessage) {
      ErrorToast(editIndustryFailMessage);
    }
  }, [editIndustrySuccessMessage, editIndustryFailMessage]);

  return (
    <>
      <h3>Edit Location</h3>
      <div className="row createRole">
        {loading || getIndustryInfoLoading ? (
          loading ? (
            <EvuemeLoader />
          ) : (
            <div>Prefilling Location info...</div>
          )
        ) : (
          <>
            <div className="valign-wrapper createRoleLeft col s12">
              <NormalInputField
                divTagCssClasses={"input-field col xl3 l4 m6 s12"}
                selectTagIdAndName={"selectColumn"}
                value={state.countryName}
                // value={selectColumn}
                labelText={"Select Country"}
              />

              <NormalInputField
                divTagCssClasses="input-field col xl7 l7 m7 s12"
                selectTagIdAndName="selectState"
                placeholder={"Select State"}
                value={state.stateName}
                // onChange={(e) => handleOnChange(e)}
                labelText={"Select State"}
              />

              <NormalInputField
                divTagCssClasses="input-field col xl7 l7 m7 s12"
                selectTagIdAndName="selectCity"
                placeholder={"Select City"}
                value={state.cityName}
                labelText={"Select City"}
              />
            </div>

            {location?.address.map((input, index) => {
              return (
                <div key={getUniqueId()} className="col xl7 l7 m7 s12">
                  <NormalInputField
                    inputTagCssClasses="validate"
                    inputTagIdAndName="address"
                    required={true}
                    rightIconSrc={inputs.length !== 1 ? icon.deleteIcon : null}
                    rightIconCss={"redColorFilter cursor-pointer"}
                    onClickRightIcon={(e) => handleRemove(index)}
                    value={input}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    divTagCssClasses="input-field col xl11 l11 m11 s12"
                    labelText={`Address ${index + 1}`}
                  />
                </div>
              );
            })}

            <div className="button">
              <div className="col xl6 l6 m12 s12 large-screen-start-small-screen-center ">
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
          </>
        )}
      </div>
    </>
  );
};

export default EditLocation;
