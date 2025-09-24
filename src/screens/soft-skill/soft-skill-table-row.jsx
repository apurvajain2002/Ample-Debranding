import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectDeleteSoftSkillId } from "../../redux/slices/soft-skill-slice";
import NormalButton from "../../components/buttons/normal-button";
import EvuemeModalTrigger from "../../components/modals/evueme-modal-trigger";
import TableDataOverflowWrapper from "../../components/table-components/table-body/table-data-overflow-wrapper";

const SoftSkillsTableRow = ({ softSkill, index }) => {
  const { id, name, description } = softSkill;
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
              navigate(`edit-soft-skill/${id}`, {
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
                dispatch(selectDeleteSoftSkillId(id));
              }}
            />
          </EvuemeModalTrigger>
        </div>
      </td>
    </tr>
  );
};

export default SoftSkillsTableRow;
