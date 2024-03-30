import { useMemo, useState } from "react";
import { useGame } from "../hooks/useGame";
import Cell, { ICell } from "./Cell";
import Tile from "./Tile";
import { v4 as uuidv4 } from "uuid";
import DirectionPad from "./DirectionPad";
const GRID_SIZE = 4;
const CELL_SIZE = 16;
const GRID_GAP = 2;

function createCells(): ICell[] {
  const cells: ICell[] = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; ++i) {
    const cell: ICell = {
      id: uuidv4(),
      cell_size: CELL_SIZE,
      x: i % GRID_SIZE,
      y: Math.floor(i / GRID_SIZE),
    };
    cells.push(cell);
  }
  return cells;
}

const Grid = () => {
  const [cellState, setCellState] = useState<ICell[]>(createCells());
  const { tileState, handleInput } = useGame(cellState, setCellState);

  const totalScore = useMemo(() => {
    const res = tileState.reduce((sum, tile) => {
      return sum + tile.value!;
    }, 0);
    return res;
  }, [tileState]);

  return (
    <>
      <div className="flex flex-col text-3xl white font-semibold text-white justify-center">
        <div>
          Attack:<span className="text-green-400">{totalScore}</span>
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
