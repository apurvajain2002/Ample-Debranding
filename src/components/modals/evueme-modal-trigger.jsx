import { forwardRef } from "react";

const EvuemeModalTrigger = forwardRef((
  { 
    children, 
    className, 
    modalId, 
    onClick = () => {}, 
    allow = true, 
    ...props 
  },
  ref
) => {
  if (!allow || !modalId) {
    return (
      <a href="#" onClick={onClick} ref={ref}>
        {children}
      </a>
    );
  }
  return (
    <a
      href={`#${modalId}`}
      className={`modal-trigger ${className}`}
      onClick={onClick}
      ref={ref}
      {...props}
    >
      {children}
    </a>
  );
});

export default EvuemeModalTrigger;