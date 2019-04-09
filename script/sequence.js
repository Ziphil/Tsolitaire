//


class Sequence {

  constructor(seed = "", recordString = "") {
    if (seed == undefined || seed == "") {
      seed = Math.floor(Math.random() * 4294967296);
    }
    this.seed = seed;
    this.game = new Game(new Random(seed));
    try {
      this.record = Record.parse(recordString);
      this.record.play(this.game);
    } catch (exception) {
      alert("棋譜が異常です。新しいゲームを開始します。\nWrong record data.");
      console.log(exception);
      this.game = new Game(new Random(seed));
      this.record = new Record();
    }
    this.timer = new Timer(recordString == "");
    this.laps = [];
  }

  startNextCombo() {
    if (!this.game.isGameclear()) {
      return;
    }
    if (!this.timer) {
      return;
    }
    this.laps.push(this.timer.count);
    this.game = new Game("", "");
    this.timer = new Timer(true);
  }

  place(tilePosition) {
    if (this.game.place(tilePosition)) {
      // 棋譜への記録は nextTile 更新前にやる
      this.record.place(this.game.nextTile, tilePosition, this.game.dealer.round, this.timer.count);
      this.game.draw();
      if (this.game.isGameclear()) {
        this.timer.stop();
      }
    }
  }

  undo() {
    if (this.game.undo()) {
      this.record.undo(this.timer.count);
      this.game.draw();
    }
  }

  redo() {
    if (this.game.redo()) {
      this.record.redo(this.timer.count);
      this.game.draw();
    }
  }

  jumpTo(round) {
    if (this.game.jumpTo(round)) {
      //this.record.jumpTo(round, this.timer.count);
      this.game.draw();
    }
  }

  rotate() {
    this.game.rotateNextTile();
  }
}
