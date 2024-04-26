import { useEffect, useMemo, useState } from "react";
import { useGame } from "../hooks/useGame";
import Cell, { ICell } from "./Cell";
import Tile from "./Tile";
import DirectionPad from "./DirectionPad";
import { useModal } from "../hooks/useModal";
import { createCells } from "../utils/createCells";
import { CELL_SIZE, GRID_GAP, GRID_SIZE } from "../constant";
import { FiRefreshCw } from "react-icons/fi";

const Grid = () => {
  const [bestScore, setBestScore] = useState(0);
  const [cellState, setCellState] = useState<ICell[]>(createCells());
  const { onOpen } = useModal();
  const { tileState, handleInput, remakeGame } = useGame(
    cellState,
    setCellState,
    setBestScore
  );

  useEffect(() => {
    const best = localStorage.getItem("BEST_SCORE");
    best == null ? setBestScore(0) : setBestScore(JSON.parse(best));
  }, []);

  const totalScore = useMemo(() => {
    const res = tileState.reduce((sum, tile) => {
      return sum + tile.value!;
    }, 0);
    return res;
  }, [tileState]);

  const width_grid = useMemo(
    () => 4 * CELL_SIZE + 5 * GRID_GAP,
    [GRID_GAP, GRID_SIZE]
  );

  return (
    <>
      <div
        className="flex justify-between items-center text-3xl white font-semibold text-white"
        style={{ width: `${width_grid}vmin` }}
      >
        <div className="flex flex-col">
          <div>
            Attack:<span className="text-green-400 pl-4">{totalScore}</span>
          </div>
          <div>
            Best:<span className="text-sky-400 pl-4">{bestScore}</span>
          </div>
        </div>
        <div
          className="cursor-pointer hover:animate-spin"
          onClick={() => {
            remakeGame();
          }}
        >
          <FiRefreshCw color="gray" opacity={0.5} />
        </div>
        <div
          className="p-4 bg-sky-400 shadow-md   rounded-lg hover:opacity-70 cursor-pointer text-xl"
          onClick={() => onOpen()}
        >
          Help
        </div>
      </div>
      <div
        className="relative grid grid-cols-4 grid-rows-4 bg-slate-400 rounded-lg"
        style={{ gap: `${GRID_GAP}vmin`, padding: `${GRID_GAP}vmin` }}
      >
        {cellState.map((item) => (
          <Cell cell_size={CELL_SIZE} key={item.id} />
        ))}
        {tileState.map((tile) => {
          return (
            <Tile
              id={tile.id}
              x={tile.x}
              y={tile.y}
              value={tile.value}
              grid_gap={GRID_GAP}
              cell_size={CELL_SIZE}
              key={tile.id}
            />
          );
        })}
      </div>
      <DirectionPad handleInput={handleInput} />
    </>
  );
};

export default Grid;
