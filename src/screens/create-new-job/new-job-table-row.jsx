import NormalButton from "../../components/buttons/normal-button";
import EvuemeModalTrigger from "../../components/modals/evueme-modal-trigger";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setDeleteLocationId } from "../../redux/slices/location-slice";

const JobTableRow = ({ location, index }) => {
  const { id, countryName, stateName, cityName, address } = location;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <tr>
      <td>{index + 1}</td>
      <td>{countryName}</td>
      <td>{stateName}</td>
      <td>{cityName}</td>
      <td>
        {address.map((val, i) => {
          return (
            <p key={i}>
              {i + 1}. {val}
            </p>
          );
        })}
      </td>

      <td>
        <div className="flex-start manage-masters-table-row">
          <NormalButton
            buttonTagCssClasses={"btn-clear"}
            buttonText={"Edit"}
            onClick={() => {
              navigate(`edit-location/${id}`, {
                state: {
                  countryName,
                  stateName,
                  cityName,
                  address,
                },
              });
            }}
          />
          <EvuemeModalTrigger modalId={"confirmDeleteModal"}>
            <NormalButton
              buttonTagCssClasses={"btn-clear btn-submit"}
              buttonText={"Delete"}
              onClick={() => {
                dispatch(setDeleteLocationId(id));
              }}
            />
          </EvuemeModalTrigger>
        </div>
      </td>
    </tr>
  );
};

export default JobTableRow;
