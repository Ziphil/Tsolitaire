//


class HistoryEntry {

  constructor(board, stones, round = null, tile = null, tilePosition = null) {
    this.board = board;
    this.stones = stones;
    this.tile = tile;
    this.tilePosition = tilePosition;
    this.round = round;
  }

  toHTML() {
    let li = $("<li>")
    let tileDiv = $("<div>");
    tileDiv.attr("class", "mini-tile");
    if (this.tile) {
      let tileTextureDiv = $("<div>");
      tileTextureDiv.attr("class", "texture");
      tileTextureDiv.css("background-image", "url(\"image/" + (this.tile.number + 1) + ".png\")");
      tileTextureDiv.css("transform", "rotate(" + (this.tile.rotation * 90) + "deg)");
      tileDiv.append(tileTextureDiv);
    }
    tileDiv.css("display", "inline-block");
    li.append(tileDiv);
    let dataDiv = $("<div>")
    dataDiv.text(this.toString());
    dataDiv.attr("class", "data");
    dataDiv.css("display", "inline-block");
    li.append(dataDiv);
    li.on("click", (event) => {
      // まだ有効にはしない
      // executor.jumpTo(this.round);
    });
    return li;
  }

  toString(short) {
    if (this.tilePosition && this.tile) {
      let row = ROW_SYMBOLS[Math.floor(this.tilePosition / 6)];
      let column = COLUMN_SYMBOLS[this.tilePosition % 6];
      let tile = this.tile.toString();
      return row + column + tile;
    } else {
      return "initial";
    }
  }
}


class History {

  constructor(board, stones) {
    this.current = 0;
    this.entries = [];
    this.entries.push(new HistoryEntry(board, stones, this.entries.length));
  }

  place(board, stones, tile = null, tilePosition = null) {
    this.current ++;
    // current 以降を削除
    this.entries.splice(this.current);
    this.entries.push(new HistoryEntry(board, stones, this.entries.length, tile, tilePosition));
  }

  undo() {
    if (this.canUndo()) {
      this.current --;
      return this.entries[this.current];
    }
  }

  redo() {
    if (this.canRedo()) {
      this.current ++;
      return this.entries[this.current];
    }
  }

  jumpTo(round) {
    if (this.canJumpTo(round)) {
      this.current = round;
      return this.entries[this.current];
    }
  }

  canUndo() {
    return this.current > 0;
  }

  canRedo() {
    return this.current < this.entries.length - 1;
  }

  canJumpTo(round) {
    return round != this.current && 0 <= round && round < this.entries.length;
  }

}
