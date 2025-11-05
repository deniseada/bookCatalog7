import { useRef, cloneElement } from "react";

function Modal({ btnLabel, children, btnClassName }) {
  const modalRef = useRef();

  function openModal() {
    modalRef.current.showModal();
  }

  function closeModal() {
    if (modalRef.current) modalRef.current.close();
  }

  const childWithClose =
    children && typeof children === "object" && children.type
      ? cloneElement(children, { closeModal })
      : children;

  return (
    <>
      <button onClick={openModal} className={btnClassName}>
        {btnLabel}
      </button>
      <dialog ref={modalRef}>{childWithClose}</dialog>
    </>
  );
}

export default Modal;
