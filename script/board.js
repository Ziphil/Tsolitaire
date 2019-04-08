//


class Board {

  constructor() {
    this.tiles = new Array(36);
  }

  place(tile, tilePosition) {
    let newTiles = this.tiles.concat();
    let newBoard = new Board();
    newTiles[tilePosition] = tile;
    newBoard.tiles = newTiles;
    return newBoard;
  }

  isEmpty(tilePosition) {
    return this.tiles[tilePosition] == undefined;
  }

  isFacingStone(tilePosition, stones) {
    for (let stone of stones) {
      if (stone.tilePosition == tilePosition) {
        return true;
      }
    }
    return false;
  }

  // この盤面に従って与えられた石を動かしたときの、移動後の位置情報をもった石を返します。
  // 石が盤外に出てしまう場合は null を返します。
  movedStone(stone) {
    let tiles = this.tiles;
    let newStone = stone;
    while (newStone && tiles[newStone.tilePosition]) {
      let tile = tiles[newStone.tilePosition];
      newStone = tile.movedStone(newStone).opposite();
    }
    return newStone;
  }

}
