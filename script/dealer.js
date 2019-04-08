//


class Dealer {

  constructor(random, avoidDeadQueue) {
    this.deck = TILES.concat();
    this.queue = [];
    this.round = 0;
    this.random = random;
    this.avoidDeadQueue = avoidDeadQueue;
  }

  get nextTile() {
    // if ではなく while にしたのは、一度も nextTile にアクセスせずにターンを終了すると queue が飛び飛びになってしまうのを避けるため
    while (this.queue.length <= this.round) {
      if (this.deck.length <= 0) {
        return null;
      }
      // ランダムに 1 枚引いて、queue の末尾に追加
      let randomIndex;
      if (this.avoidDeadQueue && this.isDeadQueue()) {
        randomIndex = this.random.next(this.deck.length - 1) + 1;
      } else {
        randomIndex = this.random.next(this.deck.length);
      }
      this.queue.push(this.deck.splice(randomIndex, 1)[0]);
    }
    return this.queue[this.round];
  }

  // 次の手を強制的に決定します (load 用)。
  set nextTile(tile) {
    // 手前の手が未決定ならエラー (無理に設定すると queue が飛び飛びになりそう)
    if (this.queue.length < this.round) {
      throw new Error("Invalid operation");
    }

    // 決定した手と同じ手なら何もせず return（こうしないと乱数が合わなくなる）
    if (this.round < this.queue.length && this.queue[this.round].number == tile.number) {
      return;
    }

    // 設定しようとしている以降の queue を削除し、deck に戻す
    this.deck.push(...this.queue.splice(this.round));

    // queue と deck でタイルが重複したり抜けたりしそうならエラー
    if (this.queue.some(x => x.number == tile.number)) {
      throw new Error("Invalid operation");
    }
    if (this.deck.filter(x => x.number == tile.number).length != 1) {
      throw new Error("Invalid operation");
    }

    this.queue.push(tile);
    this.deck = this.deck.filter((x) => {
      return x.number != tile.number;
    });

    // 乱数のつじつまを合わせる
    this.random.next(1);
  }

  isDeadQueue() {
    return this.queue.every(x => [0, 1, 2, 9, 12, 13, 14, 23, 31, 32, 33].indexOf(x.number) >= 0)
  }
}
