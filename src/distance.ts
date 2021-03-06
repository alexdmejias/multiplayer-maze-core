class Distance {
  cells = {};

  constructor (rootId) {
  }

  get (cellId) {
    return this.cells[cellId];
  }

  set (cellId, distance) {
    if (Object.keys(this.cells).indexOf(cellId) === -1) {
      this.cells[cellId] = distance;
    }
  }

  getKeys () {
    return Object.keys(this.cells);
  }

}

export default Distance;
