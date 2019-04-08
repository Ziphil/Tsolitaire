//


class Sequence {

  constructor(seed = "", recordString = "") {
    if (seed == undefined || seed == "") {
      seed = Math.floor(Math.random() * 4294967296);
    }
    this.seed = seed;
    this.tsuro = new Tsuro(new Random(seed));
    try {
      this.record = Record.parse(recordString);
      this.record.play(this.tsuro);
    } catch (exception) {
      alert("棋譜が異常です。新しいゲームを開始します。\nWrong record data.");
      console.log(exception);
      this.tsuro = new Tsuro(new Random(seed));
      this.record = new Record();
    }
    this.timer = new Timer(recordString == "");
    this.laps = [];
  }

  startNextCombo() {
    if (!this.tsuro.isGameclear()) {
      return;
    }
    if (!this.timer) {
      return;
    }
    this.laps.push(this.timer.count);
    this.tsuro = new Tsuro("", "");
    this.timer = new Timer(true);
  }

  place(tilePosition) {
    if (this.tsuro.place(tilePosition)) {
      // 棋譜への記録は nextTile 更新前にやる
      this.record.place(this.tsuro.nextTile, tilePosition, this.tsuro.dealer.round, this.timer.count);
      this.tsuro.draw();
      if (this.tsuro.isGameclear()) {
        this.timer.stop();
      }
    }
  }

  undo() {
    if (this.tsuro.undo()) {
      this.record.undo(this.timer.count);
      this.tsuro.draw();
    }
  }

  redo() {
    if (this.tsuro.redo()) {
      this.record.redo(this.timer.count);
      this.tsuro.draw();
    }
  }

  jumpTo(round) {
    if (this.tsuro.jumpTo(round)) {
      //this.record.jumpTo(round, this.timer.count);
      this.tsuro.draw();
    }
  }

  rotate() {
    this.tsuro.rotateNextTile();
  }
}
