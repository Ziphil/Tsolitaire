//


class Tile {

  constructor(number, symmetry, connections) {
    this.number = number;
    this.symmetry = symmetry;
    this.rotation = 0;
    this.connections = connections;
  }

  // このタイルに沿って与えられた石を動かしたときの、移動後の位置情報をもった石を返します。
  // 石のタイル位置を変化しません。
  movedStone(stone) {
    let edgePosition = stone.edgePosition;
    let newEdgePosition = this.connections[edgePosition];
    let newStone = new Stone(stone.number, stone.tilePosition, newEdgePosition);
    return newStone;
  }

  rotate(rotation = 1) {
    if (rotation > 0) {
      let connections = this.connections;
      let newConnections = new Array(8);
      for (let i = 0 ; i < 8 ; i ++) {
        newConnections[i] = (connections[(i + 6) % 8] + 2) % 8;
      }
      let newTile = new Tile(this.number, this.symmetry, newConnections);
      newTile.rotation = (this.rotation + 1) % this.symmetry;
      newTile = newTile.rotate(rotation - 1);
      return newTile;
    } else {
      return this;
    }
  }

  toString() {
    return this.number + ROTATION_SYMBOLS[this.rotation];
  }

}
