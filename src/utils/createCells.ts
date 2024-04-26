import { ICell } from "../components/Cell";
import { v4 as uuidv4 } from "uuid";
import { CELL_SIZE, GRID_SIZE } from "../constant";

export function createCells(): ICell[] {
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
