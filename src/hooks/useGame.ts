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

export const useGame = (
  cellState: ICell[],
  setCellState: any,
  setBestScore: any
) => {
  const [tileState, setTileState] = useState<ITile[]>([]);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [direction, setDirection] = useState("");
  const [isMoving, setIsMoving] = useState(false);
  const [isWin, setIsWin] = useState(false);

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
  }, [cellState, setCellState, setTileState]);

  const slideTiles = useCallback(
    (cells: Array<ICell[]>) => {
      let newCells = [...cells];
      let newTiles = [...tileState];
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
              tile.id === cell.tile!.id
                ? { ...tile, x: lastValidCell!.x!, y: lastValidCell!.y! }
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
            value: cell.tile!.value! + cell.mergeTile.value!,
            x: cell.x!,
            y: cell.y!,
          },
        };
        setTileState((tiles) =>
          tiles
            .filter((tile) => tile.id !== cell.mergeTile!.id)
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

  const handleInput = useCallback(
    (e: any) => {
      console.log(e.key);
      if (isMoving) {
        return;
      }
      switch (e.key) {
        case "w":
          if (!canMoveUp()) {
            setupInput();
            return;
          }
          moveUp();
          break;
        case "s":
          if (!canMoveDown()) {
            setupInput();
            return;
          }
          moveDown();
          break;
        case "a":
          if (!canMoveLeft()) {
            setupInput();
            return;
          }
          moveLeft();
          break;
        case "d":
          if (!canMoveRight()) {
            setupInput();
            return;
          }
          moveRight();
          break;
        case "ArrowUp":
          if (!canMoveUp()) {
            setupInput();
            return;
          }
          moveUp();
          break;
        case "ArrowDown":
          if (!canMoveDown()) {
            setupInput();
            return;
          }
          moveDown();
          break;
        case "ArrowLeft":
          if (!canMoveLeft()) {
            setupInput();
            return;
          }
          moveLeft();
          break;
        case "ArrowRight":
          if (!canMoveRight()) {
            setupInput();
            return;
          }
          moveRight();
          break;
        default:
          setupInput();
          return;
      }
      setIsMoving(() => true);

      delay(100).then(() => {
        setIsMoving(() => false);
        mergeTiles();

        randomTile();
      });

      setupInput();

      return;
    },
    [tileState, canMove, moveUp, moveDown, moveLeft, moveRight]
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      e.stopPropagation();
      // e.preventDefault();
      const touch = e.touches[0];
      setStartX(touch.clientX);
      setStartY(touch.clientY);
    },
    [setStartX, setStartY]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.stopPropagation();

      // e.preventDefault();

      if (!e.touches.length) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      // 确定滑动方向
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 水平方向滑动
        setDirection(deltaX > 0 ? "ArrowRight" : "ArrowLeft");
      } else {
        // 垂直方向滑动
        setDirection(deltaY > 0 ? "ArrowDown" : "ArrowUp");
      }
    },
    [setDirection, direction]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      e.stopPropagation();

      // 处理滑动结束逻辑，例如根据方向执行特定操作
      // e.preventDefault();

      handleInput({ key: direction });
      // 重置方向
      setDirection("");
    },
    [setDirection, direction, handleInput]
  );

  const setupInput = useCallback(() => {
    window.addEventListener("keydown", handleInput, { once: true });
  }, [handleInput]);

  useEffect(() => {
    randomTile();
    randomTile();
  }, []);

  useEffect(() => {
    setupInput();

    return () => {
      window.removeEventListener("keydown", handleInput);
    };
  }, [tileState, cellState]);

  useEffect(() => {
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    // 组件卸载时的清理工作
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [startX, startY, direction]);

  useEffect(() => {
    if (!isWin && Math.max(...tileState.map((tile) => tile.value)) === 2048) {
      alert("you win");
      setIsWin(() => true);
    } else if (
      !canMoveUp() &&
      !canMoveDown() &&
      !canMoveLeft() &&
      !canMoveRight()
    ) {
      const res = tileState.reduce((sum, tile) => {
        return sum + tile.value!;
      }, 0);
      alert("you lose.");
      const best = parseInt(localStorage.getItem("BEST_SCORE") || "0");

      if (res > best) {
        setBestScore(res);
        localStorage.setItem("BEST_SCORE", JSON.stringify(res));
      }
    }
  }, [cellState, cellsByColumn, cellsByRow, tileState]);

  return {
    tileState,
    handleInput,
  };
};
