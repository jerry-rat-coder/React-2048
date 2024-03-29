import {
  FiArrowUp,
  FiArrowDown,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import "tailwindcss/tailwind.css";

interface IDirectionPad {
  handleInput: (e: any) => void;
}

const DirectionPad = ({ handleInput }: IDirectionPad) => {
  return (
    <div className="flex justify-center items-center md:hidden">
      <div
        className="p-10 bg-black bg-opacity-25 rounded-full flex flex-wrap justify-center items-center"
        style={{ width: 200, height: 200, position: "relative" }}
      >
        <FiArrowUp
          size={24}
          className="w-8 h-8 text-white absolute"
          style={{ top: 0, left: "50%", transform: "translateX(-50%)" }}
          onClick={() => handleInput({ key: "ArrowUp" })}
        />
        <FiArrowDown
          size={24}
          className="w-8 h-8 text-white absolute"
          style={{ bottom: 0, left: "50%", transform: "translateX(-50%)" }}
          onClick={() => handleInput({ key: "ArrowDown" })}
        />
        <FiArrowLeft
          size={24}
          className="w-8 h-8 text-white absolute"
          style={{ left: 0, top: "50%", transform: "translateY(-50%)" }}
          onClick={() => handleInput({ key: "ArrowLeft" })}
        />
        <FiArrowRight
          size={24}
          className="w-8 h-8 text-white absolute"
          style={{ right: 0, top: "50%", transform: "translateY(-50%)" }}
          onClick={() => handleInput({ key: "ArrowRight" })}
        />
      </div>
    </div>
  );
};

export default DirectionPad;
