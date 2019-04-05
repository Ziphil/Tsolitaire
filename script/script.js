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

}


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


const TILES = [
  new Tile(0, 1, [1, 0, 3, 2, 5, 4, 7, 6]),
  new Tile(1, 4, [1, 0, 3, 2, 6, 7, 4, 5]),
  new Tile(2, 4, [1, 0, 3, 2, 7, 6, 5, 4]),
  new Tile(3, 4, [1, 0, 4, 6, 2, 7, 3, 5]),
  new Tile(4, 4, [1, 0, 4, 7, 2, 6, 5, 3]),
  new Tile(5, 4, [1, 0, 5, 6, 7, 2, 3, 4]),
  new Tile(6, 4, [1, 0, 5, 7, 6, 2, 4, 3]),
  new Tile(7, 4, [1, 0, 6, 4, 3, 7, 2, 5]),
  new Tile(8, 4, [1, 0, 6, 5, 7, 3, 2, 4]),
  new Tile(9, 2, [1, 0, 6, 7, 5, 4, 2, 3]),
  new Tile(10, 4, [1, 0, 7, 4, 3, 6, 5, 2]),
  new Tile(11, 4, [1, 0, 7, 5, 6, 3, 4, 2]),
  new Tile(12, 2, [1, 0, 7, 6, 5, 4, 3, 2]),
  new Tile(13, 2, [2, 3, 0, 1, 6, 7, 4, 5]),
  new Tile(14, 4, [2, 3, 0, 1, 7, 6, 5, 4]),
  new Tile(15, 4, [2, 4, 0, 6, 1, 7, 3, 5]),
  new Tile(16, 4, [2, 4, 0, 7, 1, 6, 5, 3]),
  new Tile(17, 4, [2, 5, 0, 6, 7, 1, 3, 4]),
  new Tile(18, 2, [2, 5, 0, 7, 6, 1, 4, 3]),
  new Tile(19, 4, [2, 6, 0, 4, 3, 7, 1, 5]),
  new Tile(20, 4, [2, 6, 0, 5, 7, 3, 1, 4]),
  new Tile(21, 4, [2, 7, 0, 4, 3, 6, 5, 1]),
  new Tile(22, 2, [2, 7, 0, 5, 6, 3, 4, 1]),
  new Tile(23, 2, [3, 2, 1, 0, 7, 6, 5, 4]),
  new Tile(24, 4, [3, 4, 6, 0, 1, 7, 2, 5]),
  new Tile(25, 4, [3, 4, 7, 0, 1, 6, 5, 2]),
  new Tile(26, 2, [3, 5, 6, 0, 7, 1, 2, 4]),
  new Tile(27, 1, [3, 6, 5, 0, 7, 2, 1, 4]),
  new Tile(28, 4, [4, 2, 1, 6, 0, 7, 3, 5]),
  new Tile(29, 2, [4, 2, 1, 7, 0, 6, 5, 3]),
  new Tile(30, 2, [4, 3, 6, 1, 0, 7, 2, 5]),
  new Tile(31, 1, [4, 5, 6, 7, 0, 1, 2, 3]),
  new Tile(32, 2, [4, 5, 7, 6, 0, 1, 3, 2]),
  new Tile(33, 1, [5, 4, 7, 6, 1, 0, 3, 2]),
  new Tile(34, 1, [7, 2, 1, 4, 3, 6, 5, 0])
];
const INITIAL_STONES = [
  new Stone(0, 1, 1),
  new Stone(1, 4, 0),
  new Stone(2, 11, 3),
  new Stone(3, 29, 2),
  new Stone(4, 34, 5),
  new Stone(5, 31, 4),
  new Stone(6, 24, 7),
  new Stone(7, 6, 6)
];

const ROW_SYMBOLS = ["1", "2", "3", "4", "5", "6"];
const COLUMN_SYMBOLS = ["A", "B", "C", "D", "E", "F"];
const ROTATION_SYMBOLS = ["T", "R", "B", "L"];

const TOP_SHIFT = [-9, -9, 24, 58, 91, 91, 58, 24];
const LEFT_SHIFT = [24, 58, 91, 91, 58, 24, -9, -9];
//const RECORD_REGEXP = /(?:(?:([0-9]+)\s*:\s*)?([0-9])\s*([A-Z])\s*([0-9]+)\s*([A-Z])\s*(\*|x)?(?:\s*\[([0-9]+)\s*:\s*([0-9]+)\])?)|(?:(?:([0-9]+)\s*:\s*)?([0-9]+)\s*\/)/;
const RECORD_REGEXP = /(?:(Undo|Redo|(?:([0-9]+)\s*:\s*)?([0-9])\s*([A-Z])\s*([0-9]+)\s*([A-Z])\s*(\*|x)?)(?:\s*\[([0-9]+)\s*:\s*([0-9]+)\])?)|(?:(?:([0-9]+)\s*:\s*)?([0-9]+)\s*\/)/;

const TWITTER_WIDTH = 560;
const TWITTER_HEIGHT = 320;
const TWITTER_MESSAGE = "Time: %t";
const TWITTER_HASHTAG = "Tsuro";


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
    if(this.tilePosition && this.tile) {
      let row = ROW_SYMBOLS[Math.floor(this.tilePosition / 6)];
      let column = COLUMN_SYMBOLS[this.tilePosition % 6];
      let number = this.tile.number;
      let rotation = ROTATION_SYMBOLS[this.tile.rotation];
      dataDiv.text(row + column + number + rotation);
    }
    else dataDiv.text("initial");
    dataDiv.css("display", "inline-block");
    li.append(dataDiv);

    li.on("click", (event)=>{
      //まだ有効にはしない
      //executor.jumpTo(this.round);
    });

    return li;
  }
}


class History {

  constructor(board, stones) {
    this.current = 0;
    this.entries = [];
    this.entries.push(new HistoryEntry(board, stones, this.entries.length));
  }

  place(board, stones, tile = null, tilePosition = null) {
    this.current++;
    //current以降を削除
    this.entries.splice(this.current);
    this.entries.push(new HistoryEntry(board, stones, this.entries.length, tile, tilePosition));
  }

  undo() {
    if (this.canUndo()) {
      this.current--;
      return this.entries[this.current];
    }
  }

  redo() {
    if (this.canRedo()) {
      this.current++
      return this.entries[this.current];
    }
  }

  jumpTo(round){
    if(this.canJumpTo(round)) {
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

  canJumpTo(round){
    return round != this.current && 0 <= round && round < this.entries.length;
  }
}


class RecordEntry {

  constructor(elapsedTime, type, number, rotation, tilePosition, round, withdrawn=false) {
    this.elapsedTime = elapsedTime;
    this.type = type;
    this.number = number;
    this.rotation = rotation;
    this.withdrawn = withdrawn;
    this.tilePosition = tilePosition;
    this.round = round;
  }

  toString(short) {
    let string = "";

    if(this.type==1) {
      string += "Undo";
    }
    else if(this.type==2) {
      string += "Redo";
    }
    else {
      if (!short)
        string += this.round + ": ";
      let row = ROW_SYMBOLS[Math.floor(this.tilePosition / 6)];
      let column = COLUMN_SYMBOLS[this.tilePosition % 6];
      let number = this.number;
      let rotation = ROTATION_SYMBOLS[this.rotation];
      string += row + column + number + rotation;
      if (this.withdrawn)
        string += "*";
    }

    if (!short) {
      if (this.elapsedTime != null) {
        let minute = ("0" + Math.floor(this.elapsedTime / 60)).slice(-2);
        let second = ("0" + (this.elapsedTime % 60)).slice(-2);
        string = string + " [" + minute + ":" + second + "]";
      }
    }
    return string;
  }

  action(tsuro){
    if (this.type == 0 && !this.withdrawn) {
      let tile = TILES[this.number];
      tsuro.nextTile = tile;
      let result = tsuro.place(tile.rotate(this.rotation), this.tilePosition);
      if (!result) {
        throw new Error("Invalid Move");
      }
    }
    else if (this.type == 1) tsuro.undo();
    else if (this.type == 2) tsuro.redo();
  }
}


class Record {

  constructor() {
    this.entries = [];
  }

  place(number, rotation, tilePosition, round, elapsedTime, withdrawn=false) {
    let entry = new RecordEntry(elapsedTime, 0, number, rotation, tilePosition, round, withdrawn);
    this.entries.push(entry);
  }

  undo(elapsedTime) {
    let entry = new RecordEntry(elapsedTime, 1);
    this.entries.push(entry);
  }

  redo(elapsedTime) {
    let entry = new RecordEntry(elapsedTime, 2);
    this.entries.push(entry);
  }

  toString(short) {
    let strings = [];
    for (let entry of this.entries) {
      let entryString = entry.toString(short);
      strings.push(entryString);
    }
    let separator = (short) ? " " : "\n";
    let string = strings.join(separator);
    return string;
  }

  play(tsuro){
    for (let entry of this.entries)
      entry.action(tsuro);
  }

  static parse(string) {
    let record = new Record();
    let regexp = new RegExp(RECORD_REGEXP, "g");
    let match;
    while ((match = regexp.exec(string)) != null) {
      if (match[0] != undefined) {
        let elapsedTime = (match[8] != undefined) ? parseInt(match[8]) * 60 + parseInt(match[9]) : null;

        if (match[1] == "Undo") {
          record.undo(elapsedTime);
        }
        else if (match[1] == "Redo") {
          record.redo(elapsedTime);
        }
        else {
          let round = parseInt(match[2]);
          let row = ROW_SYMBOLS.indexOf(match[3]);
          let column = COLUMN_SYMBOLS.indexOf(match[4]);
          let tilePosition = row * 6 + column;
          let number = parseInt(match[5]);
          let rotation = ROTATION_SYMBOLS.indexOf(match[6]);
          let withdrawn = !!match[7];
          if (0 <= tilePosition && tilePosition < 36 && number < TILES.length && rotation >= 0)
            record.place(number, rotation, tilePosition, round, elapsedTime, withdrawn);
          else
            throw new Error("Invalid Record");
        }
      } else {
        //ここの意図がよくわからない（下位互換性？）
        let number = parseInt(match[10]);
        let tile = TILES[number];
        deck = deck.filter((tile) => {
          return tile.number != number;
        });
      }
    }
    return record;
  }
}

class Random {
  constructor(seed) {
    if(seed==undefined || seed=="") seed = Math.floor(Math.random()*4294967296);
    this.seed = seed;

    this.x = 123456789;
    this.y = 362436069;
    this.z = 521288629;

    if(Number.isInteger(seed)) this.w = seed;
    else if(!isNaN(parseInt(seed))) this.w = parseInt(seed);
    else this.w = Random.hash(seed);
  }

  //0～n-1までの乱数を返す。
  new(n) {
    let t;
    t = this.x ^ (this.x << 11);
    this.x = this.y; this.y = this.z; this.z = this.w;
    this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));

    //mod計算（0を足すのは-0が気持ち悪いから）
    let value = this.w % n + 0;
    if (value < 0) value += n;
    return value;
  }
  //適当なHash
  static hash(object) {
    var string = object+"";
    var hash=0;
    for(var i=0; i<string.length; i+=2){
      if(string.length == i+1) hash ^= string.charCodeAt(i)<<16;
      else hash ^= (string.charCodeAt(i)<<16)+string.charCodeAt(i+1);
    }
    return hash;
  }
}

class Tsuro {

  constructor(random) {
    this.deck = TILES.concat();
    this.queue = [];
    this.stones = INITIAL_STONES;
    this.board = new Board();
    this.history = new History(this.board, this.stones);
    this.finishDate = null;
    this.round = 0;
    this.random = random;
  }

  place(tile, tilePosition) {
    let result = this.check(tile, tilePosition);
    if (result != null) {
      this.board = result.board;
      this.stones = result.stones;
      this.round ++;
      this.history.place(this.board, this.stones, tile, tilePosition);
      if (this.finishDate == null && this.deck.length <= 0) {
        this.finishDate = new Date();
      }
      return true;
    } else {
      return false;
    }
  }

  undo() {
    let entry = this.history.undo();
    if (entry) {
      this.board = entry.board;
      this.stones = entry.stones;
      this.round --;
      return true;
    } else {
      return false;
    }
  }

  redo() {
    let entry = this.history.redo();
    if (entry) {
      this.board = entry.board;
      this.stones = entry.stones;
      this.round ++;
      return true;
    } else {
      return false;
    }
  }

  jumpTo(round) {
    let entry = this.history.jumpTo(round);
    if (entry) {
      this.board = entry.board;
      this.stones = entry.stones;
      this.round = round;
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

  // 次に置くべきタイルを特定の場所に特定の回転で置けるかどうかを調べます。
  // 置けるのであれば、置いた後の盤面と石の状態を返します。
  // その場所に石が面していなかったり石が盤外に出てしまうなどの理由で置けない場合は、null を返します。
  // また、全てのタイルを置き切っていて次のタイルがない場合も、null を返します。
  check(tile, tilePosition) {
    let board = this.board;
    if (tile && board.isEmpty(tilePosition) && board.isFacingStone(tilePosition, this.stones)) {
      let newBoard = this.board.place(tile, tilePosition);
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

  placeableTilePositions(tile) {
    let tilePositions = [];
    for (let tilePosition = 0 ; tilePosition < 36 ; tilePosition ++) {
      let result = this.check(tile, tilePosition);
      if (result != null) {
        tilePositions.push(tilePosition);
      }
    }
    return tilePositions;
  }

  isPlaceable(tile) {
    for (let rotation = 0 ; rotation < 4 ; rotation ++) {
      if (this.placeableTilePositions(tile.rotate(rotation)).length > 0) {
        return true;
      }
    }
    return false;
  }

  get nextTile() {
    //ifではなくwhileにしたのは、一度もnextTileにアクセスせずにターンを終了するとopenedTileが飛び飛びになってしまうのを避けるため
    while (this.queue.length <= this.round) {
      let randomIndex = this.random.new(this.deck.length);
      //ランダムに一枚引いて、openedの末尾に追加
      this.queue.push(this.deck.splice(randomIndex, 1)[0]);
      if (this.deck.length <= 0) return null;
    }
    return this.queue[this.round];
  }

  //次の手を強制的に決定（load用）
  set nextTile(tile) {
    //既に手が決定していた場合
    if(this.round < this.queue.length){
       //決定した手と期待する手が同じなら問題ない。何もせず終了
       if(this.queue[this.round].number == tile.number) return;
       //そうでなければエラー
       else throw new Error("Invalid operation");
    }
    //手前の手が未決定ならエラー（無理に設定するとopenedTileが飛び飛びになりそう）
    if(this.queue.length < this.round) throw new Error("Invalid operation");
    //queueとdeckでタイルが重複したり抜けたりしそうならエラー
    if(this.queue.some(x=>x.number == tile.number)) throw new Error("Invalid operation");
    if(this.deck.filter(x=>x.number == tile.number).length != 1) throw new Error("Invalid operation");

    this.queue.push(tile);
    this.deck = this.deck.filter((x)=>{
      return x.number != tile.number;
    });

    //乱数のつじつまを合わせる
    this.random.new(1);
  }

}


class Executor {

  load(seed = "", record = "") {
    try {
      this.random = new Random(seed);
      this.tsuro = new Tsuro(this.random);
      this.record = Record.parse(record);
      this.record.play(this.tsuro);
    } catch {
      alert("棋譜が異常です。新しいゲームを開始します。");
      this.random = new Random(seed);
      this.tsuro = new Tsuro(this.random);
      this.record = new Record();
    }
    this.nextTile = this.tsuro.nextTile;
    this.hoveredTilePosition = null;
    this.beginDate = record=="" ? new Date() : null;
    this.render();
    $('#newgame-dialogue').css("display", "none");
  }

  init() {
    let seed = "";
    let record = "";
    let pairs = location.search.substring(1).split("&");
    for (let pair of pairs) {
      let match;
      if ((match = pair.match(/q=(.+)/)) != null) {
        record = decodeURIComponent(match[1]);
      }
      if ((match = pair.match(/s=(.+)/)) != null) {
        seed = decodeURIComponent(match[1]);
      }
    }
    this.load(seed, record);
  }

  prepare() {
    this.prepareTiles();
    this.prepareStones();
    this.prepareNextTile();
    this.prepareDeck();
    this.prepareTimer();
    this.prepareCheckBoxes();
    this.init();
    this.render();
  }

  prepareTiles() {
    let tilesDiv = $("#tiles");
    for (let i = 0 ; i < 36 ; i ++) {
      let j = i;
      let tileDiv = $("<div>");
      let rowNumber = Math.floor(i / 6)
      if ((rowNumber % 2 == 0 && i % 2 == 0) || (rowNumber % 2 == 1 && i % 2 == 1)) {
        tileDiv.attr("class", "tile alternative");
      } else {
        tileDiv.attr("class", "tile");
      }
      tileDiv.attr("id", "tile-" + i);
      tileDiv.on("mousedown", (event) => {
        if (event.button == 0) {
          this.place(j);
        } else if (event.button == 2) {
          this.rotate();
        }
      });
      tileDiv.on("contextmenu", (event) => {
        event.preventDefault();
      });
      tileDiv.on("mouseenter", (event) => {
        this.hover(j);
      });
      tileDiv.on("mouseleave", (event) => {
        this.hover(null);
      });
      tilesDiv.append(tileDiv);
    }
  }

  prepareDeck() {
    let deckDiv = $("#deck");
    for (let i = 0 ; i < 35 ; i ++) {
      let tileDiv = $("<div>");
      let rowNumber = Math.floor(i / 6)
      if ((rowNumber % 2 == 0 && i % 2 == 0) || (rowNumber % 2 == 1 && i % 2 == 1)) {
        tileDiv.attr("class", "mini-tile alternative");
      } else {
        tileDiv.attr("class", "mini-tile");
      }
      tileDiv.attr("id", "tile-" + i);
      deckDiv.append(tileDiv);
    }
  }

  prepareStones() {
    let stonesDiv = $("#stones");
    for (let i = 0 ; i < 8 ; i ++) {
      let stoneDiv = $("<div>");
      stoneDiv.attr("class", "stone");
      stoneDiv.attr("id", "stone-" + i);
      stoneDiv.css("background-image", "url(\"image/" + (i + 37) + ".png\")");
      stonesDiv.append(stoneDiv);
    }
  }

  prepareNextTile() {
    let tileDiv = $("#next-tile");
    tileDiv.on("mousedown", (event) => {
      this.rotate();
    });
    tileDiv.on("contextmenu", (event) => {
      event.preventDefault();
    });
  }

  prepareTimer() {
    setInterval(() => {
      let elapsedTime = this.elapsedTime;
      let minute = (elapsedTime != null) ? ("0" + Math.floor(elapsedTime / 60)).slice(-2) : "  ";
      let second = (elapsedTime != null) ? ("0" + (elapsedTime % 60)).slice(-2) : "  ";
      if ($("#minute").text() != minute) {
        $("#minute").text(minute);
      }
      if ($("#second").text() != second) {
        $("#second").text(second);
      }
    }, 50);
  }

  get elapsedTime() {
    let beginDate = this.beginDate;
    if (beginDate) {
      let endDate = this.finishDate || new Date();
      let elapsedTime = Math.floor((endDate.getTime() - beginDate.getTime()) / 1000);
      if (elapsedTime > 3600) {
        elapsedTime = 3600;
      }
      return elapsedTime;
    } else {
      return null;
    }
  }

  prepareCheckBoxes() {
    $("#show-timer").on("change", (event) => {
      if(event.target.checked) $("#timer").css("display", "flex");
      else $("#timer").css("display", "none");
    });
    $("#show-suggest").on("change", (event) => {
      this.render();
    });
    $("#show-deck").on("change", (event) => {
      this.render();
    });
    $("#show-queue").on("change", (event) => {
      this.render();
    });
    $("#show-history").on("change", (event) => {
      this.render();
    });
    $("#show-gameover").on("change", (event) => {
      this.render();
    });
    $("#show-information").on("change", (event) => {
      this.render();
    });
  }

  place(tilePosition) {
    let result = this.tsuro.place(this.nextTile, tilePosition);
    if (result) {
      this.record.place(this.nextTile.number, this.nextTile.rotation, tilePosition, this.tsuro.round, this.elapsedTime);
      this.nextTile = this.tsuro.nextTile;
      }
    this.render();
  }

  rotate() {
    this.nextTile = this.nextTile.rotate();
    this.render();
  }

  hover(tilePosition) {
    this.hoveredTilePosition = tilePosition;
    this.render();
  }

  undo() {
    let result = this.tsuro.undo();
    if (result) {
      this.record.undo(this.elapsedTime);
      this.nextTile = this.tsuro.nextTile;
    }
    this.render();
  }

  redo() {
    let result = this.tsuro.redo();
    if (result) {
    this.record.redo(this.elapsedTime);
      this.nextTile = this.tsuro.nextTile;
    }
    this.render();
  }

  jumpTo(round) {
    let result = this.tsuro.jumpTo(round);
    if (result) {
    //this.record.redo(this.elapsedTime);
      this.nextTile = this.tsuro.nextTile;
    }
    this.render();
  }

  render() {
    this.renderTiles();
    this.renderStones();
    this.renderSuggest();
    this.renderInformation();
    this.renderNextTile();
    this.renderNextTileInformation();
    this.renderRest();
    this.renderDeck();
    this.renderQueue();
    this.renderHistory();
    this.renderButtons();
    this.renderShareData();
  }

  renderTiles() {
    let tiles = this.tsuro.board.tiles;
    for (let i = 0 ; i < tiles.length ; i ++) {
      let tile = tiles[i];
      let tileDiv = $("#board #tile-" + i);
      tileDiv.empty();
      if (tile) {
        let tileTextureDiv = $("<div>");
        tileTextureDiv.attr("class", "texture");
        tileTextureDiv.css("background-image", "url(\"image/" + (tile.number + 1) + ".png\")");
        tileTextureDiv.css("transform", "rotate(" + (tile.rotation * 90) + "deg)");
        tileDiv.append(tileTextureDiv);
      }
      else if (this.nextTile && i == this.hoveredTilePosition) {
        let hoverTextureDiv = $("<div>");
        hoverTextureDiv.attr("class", "texture hover");
        hoverTextureDiv.css("background-image", "url(\"image/" + (this.nextTile.number + 1) + ".png\")");
        hoverTextureDiv.css("transform", "rotate(" + (this.nextTile.rotation * 90) + "deg)");
        tileDiv.append(hoverTextureDiv);
      }
    }
  }

  renderStones() {
    let stones = this.tsuro.stones;
    for (let i = 0 ; i < stones.length ; i ++) {
      let stone = stones[i];
      let top = Math.floor(stone.tilePosition / 6) * 100 + TOP_SHIFT[stone.edgePosition];
      let left = (stone.tilePosition % 6) * 100 + LEFT_SHIFT[stone.edgePosition];
      let stoneDiv = $("#stone-" + stone.number);
      stoneDiv.css("top", top + "px");
      stoneDiv.css("left", left + "px");
    }
  }

  renderSuggest() {
    if ($("#show-suggest").is(":checked")) {
      let tilePositions = this.tsuro.placeableTilePositions(this.nextTile);
      for (let tilePosition of tilePositions) {
        let tileDiv = $("#board #tile-" + tilePosition);
        let suggestDiv = $("<div>");
        suggestDiv.attr("class", "suggest");
        tileDiv.append(suggestDiv);
      }
    }
    if ($("#show-gameover").is(":checked") && !this.tsuro.isPlaceable(this.nextTile) && this.tsuro.deck.length > 0) {
      $("#gameover").css("display", "flex");
    } else {
      $("#gameover").css("display", "none");
    }
  }

  renderInformation() {
    if ($("#show-information").is(":checked")) {
      for (let entry of this.record.entries) {
        if (!entry.withdrawn) {
          let tileDiv = $("#board #tile-" + entry.tilePosition);
          let tileInformationDiv = $("<div>");
          tileInformationDiv.attr("class", "information");
          tileInformationDiv.html(entry.round + ":<br>" + entry.toString(true));
          tileDiv.append(tileInformationDiv);
        }
      }
    }
  }

  renderNextTile() {
    let tileDiv = $("#next-tile");
    tileDiv.empty();
    if (this.nextTile) {
      let tileTextureDiv = $("<div>");
      tileTextureDiv.attr("class", "texture");
      tileTextureDiv.css("background-image", "url(\"image/" + (this.nextTile.number + 1) + ".png\")");
      tileTextureDiv.css("transform", "rotate(" + (this.nextTile.rotation * 90) + "deg)");
      tileDiv.append(tileTextureDiv);
    }
  }

  renderNextTileInformation() {
    if ($("#show-information").is(":checked")) {
      let tileDiv = $("#next-tile");
      if (this.nextTile) {
        let tileInformationDiv = $("<div>");
        let number = this.nextTile.number;
        let rotation = ROTATION_SYMBOLS[this.nextTile.rotation];
        let string = number + rotation;
        tileInformationDiv.attr("class", "information");
        tileInformationDiv.html(string);
        tileDiv.append(tileInformationDiv);
      }
    }
  }

  renderDeck() {
    let deck = this.tsuro.deck;
    for (let i = 0 ; i < 35 ; i ++) {
      let tileDiv = $("#deck #tile-" + i);
      tileDiv.empty();
    }

    for (let tile of deck) {
      let tileDiv = $("#deck #tile-" + tile.number);
      let tileTextureDiv = $("<div>");
      tileTextureDiv.attr("class", "texture");
      tileTextureDiv.css("background-image", "url(\"image/" + (tile.number + 1) + ".png\")");
      tileTextureDiv.css("transform", "rotate(" + (tile.rotation * 90) + "deg)");
      tileDiv.append(tileTextureDiv);
    }
    if ($("#show-deck").is(":checked")) $("#deck").css("display", "flex");
    else $("#deck").css("display", "none");
  }

  renderQueue() {
    let queue = this.tsuro.queue;
    let queueDiv = $("#queue");
    queueDiv.empty();

    for (let tile of queue) {
      let tileDiv = $("<div>");
      tileDiv.attr("class", "mini-tile");
      let tileTextureDiv = $("<div>");
      tileTextureDiv.attr("class", "texture");
      tileTextureDiv.css("background-image", "url(\"image/" + (tile.number + 1) + ".png\")");
      tileTextureDiv.css("transform", "rotate(" + (tile.rotation * 90) + "deg)");
      tileDiv.append(tileTextureDiv);
      queueDiv.append(tileDiv);
    }
    queueDiv.children().eq(this.tsuro.round).addClass("next");

    if ($("#show-queue").is(":checked")) queueDiv.css("display", "flex");
    else queueDiv.css("display", "none");
  }

  renderHistory() {
    let entries = this.tsuro.history.entries;
    let historyUl = $("#history");
    historyUl.empty();

    for (let entry of entries) {
      historyUl.append(entry.toHTML());
    }
    historyUl.children().eq(this.tsuro.round).addClass("current");

    if ($("#show-history").is(":checked")) $("#history-wrapper").css("display", "flex");
    else $("#history-wrapper").css("display", "none");
  }

  renderRest() {
    let rest = 35 - this.tsuro.round;
    let restDiv = $("#rest");
    restDiv.text(rest);
  }

  renderButtons() {
    if (this.tsuro.canUndo()) {
      $("#undo").attr("class", "");
    } else {
      $("#undo").attr("class", "disabled")
    }
    if (this.tsuro.canRedo()) {
      $("#redo").attr("class", "");
    } else {
      $("#redo").attr("class", "disabled")
    }
  }

  renderShareData() {
    $("#share-record").val(this.record.toString(false));
    $("#share-seed").val(this.random.seed);
    $("#share-link").val(this.generateURL());
  }

  tweet() {
    let elapsedTime = this.elapsedTime;
    let minute = ("0" + Math.floor(elapsedTime / 60)).slice(-2);
    let second = ("0" + (elapsedTime % 60)).slice(-2);
    let url = this.generateURL();
    let option = "width=" + TWITTER_WIDTH + ",height=" + TWITTER_HEIGHT + ",menubar=no,toolbar=no,scrollbars=no";
    let href = "https://twitter.com/intent/tweet";
    href += "?text=" + TWITTER_MESSAGE.replace(/%t/g, minute + ":" + second);
    href += "&url=" + encodeURIComponent(url);
    href += "&hashtags=" + TWITTER_HASHTAG;
    window.open(href, "_blank", option);
  }

  generateURL(){
    return location.protocol + "//" + location.host + location.pathname
     + "?s=" + this.random.seed + "&q=" + encodeURIComponent(this.record.toString(false));
  }

}


let executor = new Executor();
$(() => {
  executor.prepare();
});
