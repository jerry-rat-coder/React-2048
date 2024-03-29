import { useCallback, useEffect, useMemo, useState } from "react";
import { ICell } from "../components/Cell";
import { ITile } from "../components/Tile";
import { v4 as uuidv4 } from "uuid";
import { delay } from "../utils/delay";

const canAccept = (cell: ICell, tile: ITile): boolean => {
  return (
    cell.tile == null ||
    (cell.mergeTile == null && cell.tile.value === tile.value)
  );
};

export const useGame = (cellState: ICell[], setCellState: any) => {
  const [tileState, setTileState] = useState<ITile[]>([]);
  const cellsByColumn = useMemo(() => {
    const cells = [...cellState];
    const res: Array<ICell[]> = [];

    cells.forEach((cell) => {
      res[cell.x!] = res[cell.x!] || [];
      res[cell.x!][cell.y!] = cell;
    });
    return res;
  }, [cellState]);

  const cellsByRow = useMemo(() => {
    const cells = [...cellState];
    const res: Array<ICell[]> = [];

    cells.forEach((cell) => {
      res[cell.y!] = res[cell.y!] || [];
      res[cell.y!][cell.x!] = cell;
    });
    return res;
  }, [cellState]);

  const updateCellState = useCallback((cells: Array<ICell[]>): ICell[] => {
    const res: Array<ICell[]> = [];

    cells.forEach((group) => {
      group.forEach((cell) => {
        res[cell.y!] = res[cell.y!] || [];
        res[cell.y!][cell.x!] = cell;
      });
    });
    return res.flatMap((group) => group);
  }, []);

  const randomTile = useCallback(() => {
    setCellState((cells: ICell[]) => {
      const newCells = [...cells];
      const emptyCells = cellState.filter((cell) => cell.tile == null);
      if (!emptyCells.length) {
        return cells;
      }
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const randomEmpty = emptyCells[randomIndex];

      const newTile: ITile = {
        id: uuidv4(),
        x: randomEmpty.x!,
        y: randomEmpty.y!,
        value: Math.random() > 0.5 ? 2 : 4,
      };
      cells.forEach((cell) => {
        if (cell.id === randomEmpty.id) {
          cell.tile = newTile;
        }
      });
      const updatedCells = newCells.map((cell) => {
        if (cell.id === randomEmpty.id) {
          return { ...cell, tile: newTile };
        }
        return cell;
      });

      setTileState((tiles: ITile[]) => [...tiles, newTile]);

      return updatedCells;
    });
  }, [cellState, tileState, setCellState, setTileState]);

  const slideTiles = useCallback(
    (cells: Array<ICell[]>) => {
      let newCells = [...cells];
      let newTiles = [...tileState];
      const newCellsState: ICell[] = [];
      cells.forEach((group) => {
        for (let i = 1; i < group.length; ++i) {
          const cell = group[i];
          if (!cell.tile || !cell.tile.id) {
            continue;
          }

          let lastValidCell: ICell | undefined;
          for (let j = i - 1; j >= 0; --j) {
            const moveToCell = group[j];
            if (!canAccept(moveToCell, cell.tile)) break;
            lastValidCell = moveToCell;
          }
          if (lastValidCell != null) {
            if (lastValidCell.tile == null) {
              lastValidCell.tile = cell.tile;
            } else {
              lastValidCell.mergeTile = cell.tile;
            }
            newCells = newCells.map((group) =>
              group.map((cell) =>
                cell.id === lastValidCell!.id ? lastValidCell! : cell
              )
            );
            newTiles = newTiles.map((tile) =>
              tile.id === cell.tile?.id
                ? { ...tile, x: lastValidCell?.x!, y: lastValidCell?.y! }
                : tile
            );

            cell.tile = null;
          }
        }
      });

      setTileState(() => newTiles);

      setCellState(() => updateCellState(newCells));
    },
    [setCellState, setTileState, tileState, cellState]
  );

  const mergeTiles = useCallback(() => {
    setCellState((cells: ICell[]) => {
      return cells.map((cell) => {
        if (!cell.mergeTile || !cell.tile) {
          return cell;
        }

        const newCell: ICell = {
          ...cell,
          mergeTile: undefined,
          tile: {
            ...cell.tile,
            value: cell.tile?.value! + cell.mergeTile.value!,
            x: cell.x!,
            y: cell.y!,
          },
        };
        setTileState((tiles) =>
          tiles
            .filter((tile) => tile.id !== cell.mergeTile?.id)
            .map((tile) =>
              tile.id === newCell.tile!.id ? newCell.tile! : tile
            )
        );
        return newCell;
      });
    });
  }, []);

  const moveUp = useCallback(() => {
    slideTiles(cellsByColumn);
  }, [slideTiles, cellsByColumn]);

  const moveDown = useCallback(() => {
    slideTiles(cellsByColumn.map((col) => [...col].reverse()));
  }, [slideTiles, cellsByColumn]);

  const moveLeft = useCallback(() => {
    slideTiles(cellsByRow);
  }, [slideTiles, cellsByRow]);

  const moveRight = useCallback(() => {
    slideTiles(cellsByRow.map((row) => [...row].reverse()));
  }, [slideTiles, cellsByRow]);

  const canMove = useCallback(
    (cells: Array<ICell[]>): boolean => {
      return cells.some((group) =>
        group.some((cell, index) => {
          if (index === 0) return false;
          if (cell.tile == null) return false;
          return canAccept(group[index - 1], cell.tile!);
        })
      );
    },
    [canAccept]
  );

  const canMoveUp = useCallback((): boolean => {
    return canMove(cellsByColumn);
  }, [cellsByColumn, canMove]);

  const canMoveDown = useCallback((): boolean => {
    return canMove(cellsByColumn.map((col) => [...col].reverse()));
  }, [cellsByColumn, canMove]);

  const canMoveLeft = useCallback((): boolean => {
    return canMove(cellsByRow);
  }, [cellsByRow, canMove]);

  const canMoveRight = useCallback((): boolean => {
    return canMove(cellsByRow.map((row) => [...row].reverse()));
  }, [cellsByRow, canMove]);
  useEffect(() => {
    randomTile();
    randomTile();
  }, []);

  useEffect(() => {
    setupInput();
    function setupInput() {
      window.addEventListener("keydown", handleInput);
    }

    function handleInput(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowUp":
          if (!canMoveUp()) {
            return;
          }
          moveUp();
          break;
        case "ArrowDown":
          if (!canMoveDown()) {
            return;
          }
          moveDown();
          break;
        case "ArrowLeft":
          if (!canMoveLeft()) {
            return;
          }
          moveLeft();
          break;
        case "ArrowRight":
          if (!canMoveRight()) {
            return;
          }
          moveRight();
          break;
        default:
          return;
      }

      delay(200).then(() => {
        mergeTiles();

        randomTile();
      });

      return;
    }

    return () => {
      window.removeEventListener("keydown", handleInput);
    };
  }, [tileState, cellState]);

  useEffect(() => {
    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
      alert("you lose.");
    }
  }, [cellState, cellsByColumn, cellsByRow]);

  return {
    tileState,
  };
};
