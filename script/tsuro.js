//


class Tsuro {

  constructor(seed, recordString) {
    if (seed == undefined || seed == "") {
      seed = Math.floor(Math.random() * 4294967296);
    }
    this.seed = seed;
    this.stones = INITIAL_STONES;
    this.board = new Board();
    this.dealer = new Dealer(seed);
    this.history = new History(this.board, this.stones);
    this.record = new Record();
    this.timer = new Timer(recordString == "");
    Record.parse(recordString).play(this);
    this.nextTile = this.dealer.nextTile;
  }

  place(tilePosition, tile) {
    let result = this.check(tilePosition);
    if (result != null) {
      this.board = result.board;
      this.stones = result.stones;

      // history への記録は新しい board と stones が必要
      this.record.place(this.nextTile, tilePosition, this.dealer.round, this.timer.count);
      // 棋譜への記録は nextTile 更新前にやる
      this.history.place(this.board, this.stones, this.nextTile, tilePosition);

      this.dealer.round ++;
      this.nextTile = this.dealer.nextTile;

      // クリア判定は nextTile 更新後にやる (nextTile を使っているので)
      if (this.isGameclear()) {
        this.timer.stop();
      }
      return true;
    } else {
      return false;
    }
  }

  undo() {
    let entry = this.history.undo();
    if (entry) {
      this.record.undo(this.timer.count);

      this.board = entry.board;
      this.stones = entry.stones;
      this.dealer.round --;
      this.nextTile = this.dealer.nextTile;
      return true;
    } else {
      return false;
    }
  }

  redo() {
    let entry = this.history.redo();
    if (entry) {
      this.record.redo(this.timer.count);

      this.board = entry.board;
      this.stones = entry.stones;
      this.dealer.round ++;
      this.nextTile = this.dealer.nextTile;
      return true;
    } else {
      return false;
    }
  }

  jumpTo(round) {
    let entry = this.history.jumpTo(round);
    if (entry) {
      // this.record.jumpTo(round, this.timer.count);

      this.board = entry.board;
      this.stones = entry.stones;
      this.dealer.round = round;
      return true;
    } else {
      return false;
    }
  }

  canUndo() {
    return this.history.canUndo();
  }

  canRedo() {
    return this.history.canRedo();
  }

  rotateNextTile() {
    if (this.nextTile) {
      this.nextTile = this.nextTile.rotate();
    }
  }

  // nextTileを回転せずに特定の場所に置けるかどうかを調べます。
  // 置けるのであれば、置いた後の盤面と石の状態を返します。
  // その場所に石が面していなかったり石が盤外に出てしまうなどの理由で置けない場合は、null を返します。
  // また、全てのタイルを置き切っていて次のタイルがない場合も、null を返します。
  check(tilePosition) {
    let board = this.board;
    if (this.nextTile && board.isEmpty(tilePosition) && board.isFacingStone(tilePosition, this.stones)) {
      let newBoard = this.board.place(this.nextTile, tilePosition);
      let newStones = new Array(this.stones.length);
      for (let i = 0 ; i < this.stones.length ; i ++) {
        let stone = this.stones[i];
        let newStone = newBoard.movedStone(stone);
        if (newStone != null) {
          newStones[i] = newStone;
        } else {
          return null;
        }
      }
      return {board: newBoard, stones: newStones};
    } else {
      return null;
    }
  }

  isGameover() {
    if (!this.nextTile) {
      return false;
    }
    let flag = true;
    for (let tilePosition = 0 ; tilePosition < 36 ; tilePosition ++) {
      // 4 回回さないと戻らないので、return しちゃだめ
      for (let rotation = 0 ; rotation < 4 ; rotation ++) {
        this.nextTile = this.nextTile.rotate();
        let success = this.check(tilePosition) != null;
        // 成功したら flag を false に
        flag = flag && !success;
      }
    }
    return flag;
  }

  isGameclear() {
    return !this.nextTile;
  }

  // 回さずに置ける場所の配列を返します。
  getSuggestPositions() {
    let tilePositions = [];
    for (let tilePosition = 0 ; tilePosition < 36 ; tilePosition ++) {
      let result = this.check(tilePosition);
      if (result != null) {
        tilePositions.push(tilePosition);
      }
    }
    return tilePositions;
  }

}
