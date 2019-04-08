//


class Sequence {

  constructor(seed = "", recordString = "") {
    try {
      this.tsuro = new Tsuro(seed, recordString);
    } catch (exception) {
      alert("棋譜が異常です。新しいゲームを開始します。\nWrong record data.");
      console.log(exception);
      this.tsuro = new Tsuro(seed, "");
    }
    this.hoveredTilePosition = null;
    this.laps = [];
  }

  startNextCombo() {
    if(!this.tsuro.isGameclear()) {
      return;
    }
    if(!this.tsuro.timer.count) {
      return;
    }
    this.laps.push(this.tsuro.timer.count);
    this.tsuro = new Tsuro("", "");
    this.hoveredTilePosition = null;
    this.render();
  }
}
