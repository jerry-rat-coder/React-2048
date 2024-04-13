import { useModal } from "../../hooks/useModal";
import Modal from "./Modal";

const HelpModal = () => {
  const body = (
    <div className="flex flex-col gap-2">
      <h2>
        <span className=" font-semibold">玩法:</span>
        控制方块移动，移动后随机生成2或4，相同数字移动时合并，合成2048时胜利，不能移动时结束游戏。
      </h2>
      <div>pc: wasd或方向键控制</div>
      <div>移动端: 点击下方对应按钮，或滑动屏幕(可能会导致页面回退等)</div>
      <div>说明: </div>
      <div className=" text-sky-400"> Attack: 当前得分</div>
      <div className=" text-green-400">Best: 历史最高得分</div>
    </div>
  );

  const { isOpen: isHelpOpen, onClose } = useModal();
  return (
    <Modal isOpen={isHelpOpen} onClose={onClose} body={body} title="2048" />
  );
};

export default HelpModal;
