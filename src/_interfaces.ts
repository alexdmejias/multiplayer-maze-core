export interface IGrid {
  grid: ICell[][];
  rows: number;
  columns;
  print (): string;
  possibleAlgos (): string[];
}

export interface ICellNeighbors {
  north: ICell,
  south: ICell;
  east: ICell;
  west: ICell;
}

export interface ICell {
  neighbors: any;
  neighborsId?: number;
  column: number;
  row: number;
  id: string;
  distance: number;
  setDistance( distance: number);
  links: any;
  position?: {top: number, left: number};
  setLink (link: ICell);
  getLink (id: string): ICell;
  delLink (cell: ICell, bidirectional: boolean);
  getLinksIds (): string[];
  isLinked (cell: ICell);
  setNeighbors (direction: string, neighbors: ICell);
  getNeighbors (direction: string): ICell;
}
