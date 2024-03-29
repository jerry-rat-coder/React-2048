import { ITile } from "./Tile";

export interface ICell {
  id?: string;
  cell_size: number;
  tile?: ITile | null;
  mergeTile?: ITile | null;
  x?: number;
  y?: number;
}

const Cell = ({ cell_size }: ICell) => {
  return (
    <>
      <div
        className="bg-slate-300 rounded-lg"
        style={{ width: `${cell_size}vmin`, height: `${cell_size}vmin` }}
      ></div>
    </>
  );
};

export default Cell;
