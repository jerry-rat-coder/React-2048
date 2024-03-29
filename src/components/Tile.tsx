import { useMemo } from "react";

export interface ITile {
  id?: string;
  x: number;
  y: number;
  value: number;
  cell_size?: number;
  grid_gap?: number;
}

const Tile = ({ x, y, value, cell_size, grid_gap, id }: ITile) => {
  const offsetTop = useMemo(() => {
    return `${y * (grid_gap! + cell_size!) + grid_gap!}vmin`;
  }, [y]);
  const offsetLeft = useMemo(() => {
    return `${x * (grid_gap! + cell_size!) + grid_gap!}vmin`;
  }, [x]);
  const lightness = useMemo(() => {
    return 100 - 9 * Math.log2(value);
  }, [value]);
  const textLightness = useMemo(() => {
    return lightness > 50 ? 10 : 90;
  }, [lightness]);
  return (
    <div
      key={id}
      className="absolute  text-black flex justify-center items-center  rounded-lg transition-all duration-200 ease-in-out animate-show"
      style={{
        top: offsetTop,
        left: offsetLeft,
        width: `${cell_size}vmin`,
        height: `${cell_size}vmin`,
        backgroundColor: `hsl(200, 50%, ${lightness}%)`,
        color: `hsl(200, 25%, ${textLightness}%)`,
        fontSize: "6vmin",
      }}
    >
      {value}
    </div>
  );
};

export default Tile;
