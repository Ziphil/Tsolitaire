//


class Stone {

  constructor(number, tilePosition, edgePosition) {
    this.number = number;
    this.tilePosition = tilePosition;
    this.edgePosition = edgePosition;
  }

  opposite() {
    let tilePosition = this.tilePosition;
    let edgePosition = this.edgePosition;
    let newTilePosition = null;
    let newEdgePosition = null;
    if (edgePosition == 0 || edgePosition == 1) {
      if (tilePosition >= 6) {
        newTilePosition = tilePosition - 6;
        newEdgePosition = 5 - edgePosition;
      }
    } else if (edgePosition == 2 || edgePosition == 3) {
      if (tilePosition % 6 != 5) {
        newTilePosition = tilePosition + 1;
        newEdgePosition = 9 - edgePosition;
      }
    } else if (edgePosition == 4 || edgePosition == 5) {
      if (tilePosition <= 29) {
        newTilePosition = tilePosition + 6;
        newEdgePosition = 5 - edgePosition;
      }
    } else if (edgePosition == 6 || edgePosition == 7) {
      if (tilePosition % 6 != 0) {
        newTilePosition = tilePosition - 1;
        newEdgePosition = 9 - edgePosition;
      }
    }
    if (newTilePosition != null && newEdgePosition != null) {
      let newStone = new Stone(this.number, newTilePosition, newEdgePosition);
      return newStone;
    } else {
      return null;
    }
  }

}
