const SelectedIcon = ({
  selectedIconText,
  onClickIcon,
  showCrossIcon = true,
  disabled = false,
}) => {
  return (
    <div className="chip">
      {selectedIconText}
      {showCrossIcon && !disabled ? (
        <i className="close material-icons" onClick={onClickIcon}>
          close
        </i>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SelectedIcon;
