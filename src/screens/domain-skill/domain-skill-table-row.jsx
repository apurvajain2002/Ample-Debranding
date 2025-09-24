import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectDeleteDomainSkillId } from "../../redux/slices/domain-skill-slice";
import NormalButton from "../../components/buttons/normal-button";
import EvuemeModalTrigger from "../../components/modals/evueme-modal-trigger";
import TableDataOverflowWrapper from "../../components/table-components/table-body/table-data-overflow-wrapper";

const DomainSkillsTableRow = ({ domainSkill, index }) => {
  const { id, name, description } = domainSkill;
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
              navigate(`edit-domain-skill/${id}`, {
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
                dispatch(selectDeleteDomainSkillId(id));
              }}
            />
          </EvuemeModalTrigger>
        </div>
      </td>
    </tr>
  );
};

export default DomainSkillsTableRow;
