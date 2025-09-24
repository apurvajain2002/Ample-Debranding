import { useEffect, useState } from "react";
import NormalButton from "../../components/buttons/normal-button";
import NormalInputField from "../../components/input-fields/normal-input-field";
import SelectInputField from "../../components/input-fields/select-input-field";
import { icon } from "../../components/assets/assets";
import { useDispatch, useSelector } from "react-redux";
import {
  getState,
  getCity,
  saveLocation,
} from "../../redux/actions/location-actions/location-actions";
import { setMessagesEmpty } from "../../redux/slices/location-slice";
import WarningToast from "../../components/toasts/warning-toast";
import EvuemeLoader from "../../components/loaders/evueme-loader";
import getUniqueId from "../../utils/getUniqueId";

const LocationSearch = () => {
  const [inputs, setInputs] = useState([""]);
  const [location, setLocation] = useState({
    countryName: "",
    stateName: "",
    cityName: "",
    address: "",
  });
  const dispatch = useDispatch();

  const handleAddInput = () => {
    setInputs([...inputs, ""]);
  };

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
    setLocation({ ...location, address: newInputs });
  };

  const handleOnChange = (e) => {
    const value = e.target.value;
    if (e.target.name === "countryName") {
      dispatch(getState({ country: 101 }));
    } else if (e.target.name === "stateName") {
      dispatch(getCity(39));
    }
    setLocation({ ...location, [e.target.name]: value });
  };

  const { isLoading, countries, states, cities } = useSelector(
    (state) => state.manageLocationsSliceReducer
  );

  useEffect(() => {
    dispatch(setMessagesEmpty());
  });

  const handleRemove = (index) => {
    const currentInputs = [...inputs];
    currentInputs.splice(index, 1);
    setInputs(currentInputs);
    setLocation({ ...location, address: currentInputs });
  };

  const handleSave = () => {
    if (Object.values(location).some((val) => !val || val[0] === "")) {
      return WarningToast("Please enter the required fields!");
    }

    dispatch(
      saveLocation({
        countryName: location.countryName,
        stateName: location.stateName,
        cityName: location.cityName,
        address: location.address,
      })
    );
  };

  return (
    <>
      <h5 style={{ fontWeight: "bold", fontSize: "16px" }}>Create Location</h5>
      <div className="row createRole">
        {isLoading ? (
          <>
            <EvuemeLoader />
          </>
        ) : (
          <>
            <div className="valign-wrapper createRoleLeft col s12">
              <SelectInputField
                divTagCssClasses={"input-field col xl3 l4 m6 s12"}
                selectTagIdAndName={"countryName"}
                options={countries}
                value={location.countryName}
                onChange={(e) => handleOnChange(e)}
                labelText={"Select Country"}
              />

              <SelectInputField
                divTagCssClasses="input-field col xl7 l7 m7 s12"
                selectTagIdAndName="stateName"
                placeholder={"Select State"}
                options={states}
                value={location.stateName}
                onChange={(e) => handleOnChange(e)}
                labelText={"Select State"}
              />

              <SelectInputField
                divTagCssClasses="input-field col xl7 l7 m7 s12"
                selectTagIdAndName="cityName"
                placeholder={"Select City"}
                options={cities}
                value={location.cityName}
                onChange={(e) => handleOnChange(e)}
                labelText={"Select City"}
              />
            </div>
            {inputs.map((input, index) => {
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
                  <div className="stackButton">
                    {index === inputs.length - 1 && (
                      <NormalButton
                        onClick={handleAddInput}
                        buttonTagCssClasses={"btn-clear"}
                        buttonText={"+Add Address"}
                      />
                    )}
                  </div>
                </div>
              );
            })}
            <div
              style={{ marginLeft: "1%" }}
              className="submitButton col s12 stackButton"
            >
              <NormalButton
                buttonTagCssClasses={"btn-submit btn-clear "}
                buttonText={"Save"}
                onClick={handleSave}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default LocationSearch;
