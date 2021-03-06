import Cell from './cell';
import Distance from './distance';
import {IGrid, ICell} from './_interfaces';
import Algos from './algos';

class Grid implements IGrid {
  rows: number;
  columns: number;
  grid: ICell[][];
  allCellConnections: number[][];

  constructor (rows: number, columns: number, algorithm?: string) {
    this.rows = rows;
    this.columns = columns;

    this.allCellConnections = this.configureCells(algorithm);
  }

  possibleAlgos (): string[] {
    return Object.keys(Algos);
  }

  createMatrix (): Cell[][] {
    const grid: Cell[][] = [];
    for (var i = 0; i < this.rows; i++) {
      grid.push([]);
      for (var h = 0; h < this.columns; h++) {
        grid[i].push(new Cell(i, h));
      }
    }

    return grid;
  }

  configureCells (algorithm?: string): number[][] {
    this.grid = this.createMatrix();
    let gridConnections = [];
    this.grid.forEach((row) => {
      const rowConnections = [];
      row.forEach((cell) => {
        const {row, column} = cell;

        cell.id = `${row}-${column}`;

        cell.setNeighbors('north', this.getCell(row - 1, column));
        cell.setNeighbors('south', this.getCell(row + 1, column));
        cell.setNeighbors('west', this.getCell(row, column - 1));
        cell.setNeighbors('east', this.getCell(row, column + 1));

        cell.position = {
          top: (cell.row * 30),
          left: (cell.column * 30)
        };

        rowConnections.push(0);
        cell.neighborsId = 0;
      });

      gridConnections.push(rowConnections);
    });

    if (algorithm && Algos.hasOwnProperty(algorithm)) {
      gridConnections = Algos[algorithm](this, 10);
    }

    return gridConnections;
  }

  getCell (row, column): ICell {
    if (this.grid[row] && this.grid[row][column]) {
      return this.grid[row][column];
    }
  }

  /**
   * Returns a string which is a combination of all the grids cells connections
   *
   * @returns {string}
   *
   */
  allCellConnectionsAsStr (): string {
    return this.allCellConnections.reduce((prev, row) => {
      return prev + row.join('') + '|';
    }, '');
  }

  wasd (): number[][] {
    const a = [];
    for (let index = 0; index < this.grid.length; index++) {
        const row = this.grid[index];
        const b = [];
        for (let h = 0; h < row.length; h++) {
            const col = row[h];
            b.push(col.asJSON())
        }
        a.push(b)
    }

    return a
  }

  randomCell (): ICell {
    const row = Math.floor(Math.random() * this.rows);
    const column = Math.floor(Math.random() * this.columns);

    return this.grid[row][column];
  }

  size (): number {
    return this.rows * this.columns;
  }

  eachCell () {
    return this.grid.reduce((prev, curr, currIndex) => {
      return prev.concat(curr);
    }, []);
  }

  getDistances (root) {
    let distances = new Distance(root.id);
    let frontier = [root];
    let currDistance = 1;
    distances.set(root.id, 0);

    while (frontier.length > 0) {
      const newFrontier = [];

      frontier.forEach((currCell) => {
        currCell.getLinksIds().forEach((currLink) => {
          if (!distances.get(currLink)) {
            distances.set(currLink, currDistance);
            newFrontier.push(currCell.getLink(currLink));
          }
        });
      });
      frontier = newFrontier;
      currDistance++;
    }

    return distances;
  }

  print (): string {
    let corner  = '+';
    let output = `${corner}${('---' + corner).repeat(this.columns)}\n`;
    this.grid.forEach((row: ICell[]) => {
      let top = '|';
      let bottom = corner;
      row.forEach((cell: ICell) => {
        let body = ` ${cell.neighborsId} `;
        let eastBoundry = (cell.isLinked(cell.neighbors.east) ? '⇢' : '|');
        top += body + eastBoundry;

        let southBoundry = (cell.isLinked(cell.neighbors.south) ? ' ⇡ ' : '---');
        bottom += southBoundry + corner;
      });
      output += top + '\n';
      output += bottom + '\n';

    });
    return output;
  }

}

export default Grid;
