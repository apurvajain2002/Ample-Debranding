import NormalButton from "../../components/buttons/normal-button";
import EvuemeModalTrigger from "../../components/modals/evueme-modal-trigger";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectDeleteIndustryId } from "../../redux/slices/industry-slice";
import TableDataOverflowWrapper from "../../components/table-components/table-body/table-data-overflow-wrapper";

const IndustryTableRow = ({ industry, index }) => {
  const { id, name, description } = industry;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <tr>
      <td>{index + 1}</td>
      <td>{name}</td>
      <TableDataOverflowWrapper content={description}/>
      <td>
        <div className="flex-start manage-masters-table-row">
          <NormalButton
            buttonTagCssClasses={"btn-clear"}
            buttonText={"Edit"}
            onClick={() => {
              navigate(`edit-industry/${id}`, {
                state: {
                  name,
                  description,
                },
              });
            }}
          />
          <EvuemeModalTrigger modalId={"confirmDeleteModal"}>
            <NormalButton
              buttonTagCssClasses={"btn-clear btn-submit"}
              buttonText={"Delete"}
              onClick={() => {
                dispatch(selectDeleteIndustryId(id));
              }}
            />
          </EvuemeModalTrigger>
        </div>
      </td>
    </tr>
  );
};

export default IndustryTableRow;
