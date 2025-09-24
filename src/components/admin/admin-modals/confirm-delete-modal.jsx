import NormalButton from "../../buttons/normal-button";
import EvuemeModal from "../../modals/evueme-modal";

const ConfirmDeleteModal = ({
  onClickNo = () => {},
  onClickYes = () => {},
}) => {
  return (
    <EvuemeModal modalId={"confirmDeleteModal"}>
      <h5> Confirm Delete</h5>
      <div className="confirmDeleteModal-div-btn-layout">
        <NormalButton
          buttonTagCssClasses={"btn-clear modal-close"}
          buttonText={"No"}
          onClick={onClickNo}
        />

        <NormalButton
          buttonTagCssClasses={"btn-clear btn-submit modal-close"}
          buttonText={"Yes"}
          onClick={onClickYes}
        />
      </div>
    </EvuemeModal>
  );
};

export default ConfirmDeleteModal;
