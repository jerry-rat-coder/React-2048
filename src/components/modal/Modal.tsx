import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

interface IModal {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title?: string;
  body?: React.ReactElement;
}

const Modal: React.FC<IModal> = ({ isOpen, onClose, title, body }) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setShowModal(false);

    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  return (
    isOpen && (
      <>
        <div
          // onClick={(e) => e.stopPropagation()}
          className="justify-center items-center flex overflow-x-hidden overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70"
        >
          <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-full md:h-auto">
            <div
              className={`
                translate 
                transition 
                duration-300 
                h-full 
                ${showModal ? "translate-y-0" : "translate-y-full"} 
                ${showModal ? "opacity-100" : " opacity-0"}
            `}
            >
              <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px]">
                  <button
                    onClick={handleClose}
                    className="p-1 border-0 absolute left-9 hover:opacity-70 transition"
                  >
                    <IoMdClose size={18} />
                  </button>
                  <div className="text-lg font-semibold">
                    {title}
                    {/* Minecraft概念版 Ver0.114514（新增自定义方块） */}
                  </div>
                </div>
                <div className="relative p-6 flex-auto">{body}</div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default Modal;
