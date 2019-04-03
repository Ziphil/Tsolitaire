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
    let nextTilePosition = null;
    let nextEdgePosition = null;
    if (edgePosition == 0 || edgePosition == 1) {
      if (tilePosition >= 6) {
        nextTilePosition = tilePosition - 6;
        nextEdgePosition = 5 - edgePosition;
      }
    } else if (edgePosition == 2 || edgePosition == 3) {
      if (tilePosition % 6 != 5) {
        nextTilePosition = tilePosition + 1;
        nextEdgePosition = 9 - edgePosition;
      }
    } else if (edgePosition == 4 || edgePosition == 5) {
      if (tilePosition <= 29) {
        nextTilePosition = tilePosition + 6;
        nextEdgePosition = 5 - edgePosition;
      }
    } else if (edgePosition == 6 || edgePosition == 7) {
      if (tilePosition % 6 != 0) {
        nextTilePosition = tilePosition - 1;
        nextEdgePosition = 9 - edgePosition;
      }
    }
    if (nextTilePosition != null && nextEdgePosition != null) {
      let nextStone = new Stone(this.number, nextTilePosition, nextEdgePosition);
      return nextStone;
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
    let nextEdgePosition = this.connections[edgePosition];
    let nextStone = new Stone(stone.number, stone.tilePosition, nextEdgePosition);
    return nextStone;
  }

  rotate(rotation = 1) {
    if (rotation > 0) {
      let connections = this.connections;
      let nextConnections = new Array(8);
      for (let i = 0 ; i < 8 ; i ++) {
        nextConnections[i] = (connections[(i + 6) % 8] + 2) % 8;
      }
      let nextTile = new Tile(this.number, this.symmetry, nextConnections);
      nextTile.rotation = (this.rotation + 1) % 4;
      nextTile = nextTile.rotate(rotation - 1);
      return nextTile;
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
    let nextTiles = this.tiles.concat();
    let nextBoard = new Board();
    nextTiles[tilePosition] = tile;
    nextBoard.tiles = nextTiles;
    return nextBoard;
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
    let nextStone = stone;
    while (nextStone && tiles[nextStone.tilePosition]) {
      let tile = tiles[nextStone.tilePosition];
      nextStone = tile.movedStone(nextStone).opposite();
    }
    return nextStone;
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
const RECORD_REGEXP = /(?:(?:([0-9]+)\s*:\s*)?([0-9])\s*([A-Z])\s*([0-9]+)\s*([A-Z])\s*(\*|x)?(?:\s*\[([0-9]+)\s*:\s*([0-9]+)\])?)|(?:(?:([0-9]+)\s*:\s*)?([0-9]+)\s*\/)/;

const TWITTER_WIDTH = 560;
const TWITTER_HEIGHT = 320;
const TWITTER_MESSAGE = "Time: %t";
const TWITTER_HASHTAG = "Tsuro";


class HistoryEntry {

  constructor(board, stones, tile = null, tilePosition = null) {
    this.board = board;
    this.stones = stones;
    this.tile = tile;
    this.tilePosition = tilePosition;
  }

}


class History {

  constructor(board, stones) {
    this.undoEntries = [];
    this.redoEntries = [];
    this.currentEntry = new HistoryEntry(board, stones);
  }

  place(board, stones, tile = null, tilePosition = null) {
    let entry = new HistoryEntry(board, stones, tile, tilePosition);
    this.undoEntries.push(this.currentEntry);
    this.redoEntries = [];
    this.currentEntry = entry;
  }

  undo() {
    if (this.canUndo()) {
      let entry = this.undoEntries.pop();
      this.redoEntries.push(this.currentEntry);
      this.currentEntry = entry;
      return entry;
    }
  }

  redo() {
    if (this.canRedo()) {
      let entry = this.redoEntries.pop();
      this.undoEntries.push(this.currentEntry);
      this.currentEntry = entry;
      return entry;
    }
  }

  canUndo() {
    return this.undoEntries.length > 0;
  }

  canRedo() {
    return this.redoEntries.length > 0;
  }

}


class RecordEntry {

  constructor(tile, tilePosition, round, elapsedTime = null) {
    this.tile = tile;
    this.tilePosition = tilePosition;
    this.round = round;
    this.elapsedTime = elapsedTime;
    this.withdrawn = false;
  }

  withdraw() {
    this.withdrawn = true;
  }

  toString(short) {
    let row = ROW_SYMBOLS[Math.floor(this.tilePosition / 6)];
    let column = COLUMN_SYMBOLS[this.tilePosition % 6];
    let tileNumber = this.tile.number;
    let rotation = ROTATION_SYMBOLS[this.tile.rotation % this.tile.symmetry];
    let string = row + column + tileNumber + rotation;
    if (this.withdrawn) {
      string += "*";
    }
    if (!short) {
      string = this.round + ": " + string;
      if (this.elapsedTime != null) {
        let minute = ("0" + Math.floor(this.elapsedTime / 60)).slice(-2);
        let second = ("0" + (this.elapsedTime % 60)).slice(-2);
        string = string + " [" + minute + ":" + second + "]";
      }
    }
    return string;
  }

}


class Record {

  constructor() {
    this.entries = [];
  }

  place(tile, tilePosition, round, elapsedTime) {
    let entry = new RecordEntry(tile, tilePosition, round, elapsedTime);
    this.entries.push(entry);
  }

  undo() {
    for (let i = this.entries.length - 1 ; i >= 0 ; i --) {
      let entry = this.entries[i];
      if (!entry.withdrawn) {
        entry.withdraw();
        break;
      }
    }
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

}


class Tsuro {

  constructor(string = null) {
    this.hands = [];
    this.stones = INITIAL_STONES;
    this.board = new Board();
    this.history = new History(this.board, this.stones);
    this.record = new Record();
    this.beginDate = new Date();
    this.finishDate = null;
    this.round = 0;
    if (string != null) {
      this.beginDate = null;
      this.load(string);
    } else {
      this.start();
    }
  }

  start() {
    let unusedTiles = TILES.concat();
    Tsuro.shuffle(unusedTiles);
    this.hands.push(...unusedTiles);
  }

  load(string) {
    let unusedTiles = TILES.concat();
    let regexp = new RegExp(RECORD_REGEXP, "g");
    let match;
    while ((match = regexp.exec(string)) != null) {
      if (match[2] != undefined) {
        let row = ROW_SYMBOLS.indexOf(match[2]);
        let column = COLUMN_SYMBOLS.indexOf(match[3]);
        let tileNumber = parseInt(match[4]);
        let rotation = ROTATION_SYMBOLS.indexOf(match[5]);
        let withdrawn = !!match[6];
        let elapsedTime = (match[7] != undefined) ? parseInt(match[7]) * 60 + parseInt(match[8]) : null;
        if (!withdrawn) {
          if (row >= 0 && column >= 0 && tileNumber < TILES.length && rotation >= 0) {
            let tile = TILES[tileNumber];
            let tilePosition = row * 6 + column;
            this.hands[this.round] = tile;
            let result = this.place(rotation, tilePosition, elapsedTime);
            if (result) {
              unusedTiles = unusedTiles.filter((tile) => {
                return tile.number != tileNumber;
              });
            } else {
              throw new Error("Invalid Move");
            }
          } else {
            throw new Error("Invalid Record");
          }
        }
      } else {
        let tileNumber = parseInt(match[10]);
        let tile = TILES[tileNumber];
        this.hands[this.round] = tile;
        unusedTiles = unusedTiles.filter((tile) => {
          return tile.number != tileNumber;
        });
      }
    }
    Tsuro.shuffle(unusedTiles);
    this.hands.push(...unusedTiles);
  }

  place(rotation, tilePosition, elapsedTime = null) {
    let result = this.check(rotation, tilePosition);
    if (result != null) {
      let tile = this.nextHand.rotate(rotation);
      this.board = result.board;
      this.stones = result.stones;
      this.round ++;
      this.history.place(this.board, this.stones, tile, tilePosition);
      this.record.place(tile, tilePosition, this.round, (elapsedTime != null) ? elapsedTime : this.elapsedTime);
      if (this.finishDate == null && this.remainingHandSize <= 0) {
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
      this.record.undo();
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
      this.record.place(entry.tile, entry.tilePosition, this.round, this.elapsedTime);
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
  check(rotation, tilePosition) {
    let board = this.board;
    if (this.nextHand && board.isEmpty(tilePosition) && board.isFacingStone(tilePosition, this.stones)) {
      let placedTile = this.nextHand.rotate(rotation);
      let nextBoard = this.board.place(placedTile, tilePosition);
      let nextStones = new Array(this.stones.length);
      for (let i = 0 ; i < this.stones.length ; i ++) {
        let stone = this.stones[i];
        let nextStone = nextBoard.movedStone(stone);
        if (nextStone != null) {
          nextStones[i] = nextStone;
        } else {
          return null;
        }
      }
      return {board: nextBoard, stones: nextStones};
    } else {
      return null;
    }
  }

  placeableTilePositions(rotation) {
    let tilePositions = [];
    for (let tilePosition = 0 ; tilePosition < 36 ; tilePosition ++) {
      let result = this.check(rotation, tilePosition);
      if (result != null) {
        tilePositions.push(tilePosition);
      }
    }
    return tilePositions;
  }

  isPlaceable() {
    for (let rotation = 0 ; rotation < 4 ; rotation ++) {
      if (this.placeableTilePositions(rotation).length > 0) {
        return true;
      }
    }
    return false;
  }

  static shuffle(array) {
    for (let i = array.length - 1 ; i > 0 ; i --){
      let j = Math.floor(Math.random() * (i + 1));
      let temporary = array[i];
      array[i] = array[j];
      array[j] = temporary;
    }
  }

  get remainingHands() {
    return this.hands.slice(this.round);
  }

  get remainingHandSize() {
    return this.hands.length - this.round;
  }

  get nextHand() {
    return this.hands[this.round];
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

}


class Executor {

  start(force) {
    if (!force) {
      let result = confirm("新しいゲームを開始します。");
      if (!result) {
        return;
      }
    }
    this.tsuro = new Tsuro();
    this.rotation = 0;
    this.hoveredTilePosition = null;
    this.render();
  }

  load(force) {
    if (!force) {
      let result = confirm("棋譜を読み込みます。");
      if (!result) {
        return;
      }
    }
    let string = $("#history").val();
    try {
      this.tsuro = new Tsuro(string);
    } catch {
      alert("棋譜が異常です。新しいゲームを開始します。")
      this.tsuro = new Tsuro();
    }
    this.rotation = 0;
    this.render();
  }

  init() {
    let string = null;
    let pairs = location.search.substring(1).split("&");
    for (let pair of pairs) {
      let match;
      if ((match = pair.match(/q=(.+)/)) != null) {
        string = decodeURIComponent(match[1]);
      }
    }
    if (string != null) {
      $("#history").val(string);
      this.load(true);
    } else {
      this.start(true);
    }
  }

  prepare() {
    this.prepareTiles();
    this.prepareStones();
    this.prepareNextHand();
    this.prepareRemainingHands();
    this.prepareTimer();
    this.prepareCheckBoxes();
    this.init();
    this.render();
  }

  prepareTiles() {
    let maskDiv = $("#mask");
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
      maskDiv.before(tileDiv);
    }
  }

  prepareRemainingHands() {
    let remainingHandDiv = $("#remaining");
    for (let i = 0 ; i < 35 ; i ++) {
      let tileDiv = $("<div>");
      let rowNumber = Math.floor(i / 6)
      if ((rowNumber % 2 == 0 && i % 2 == 0) || (rowNumber % 2 == 1 && i % 2 == 1)) {
        tileDiv.attr("class", "tile alternative");
      } else {
        tileDiv.attr("class", "tile");
      }
      tileDiv.attr("id", "tile-" + i);
      remainingHandDiv.append(tileDiv);
    }
  }

  prepareStones() {
    let maskDiv = $("#mask");
    for (let i = 0 ; i < 8 ; i ++) {
      let stoneDiv = $("<div>");
      stoneDiv.attr("class", "stone");
      stoneDiv.attr("id", "stone-" + i);
      stoneDiv.css("background-image", "url(\"image/" + (i + 37) + ".png\")");
      maskDiv.before(stoneDiv);
    }
  }

  prepareNextHand() {
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
      let elapsedTime = this.tsuro.elapsedTime;
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

  prepareCheckBoxes() {
    $("#show-suggest").on("change", (event) => {
      this.render();
    });
    $("#show-remaining").on("change", (event) => {
      this.render();
    });
    $("#show-mask").on("change", (event) => {
      this.render();
    });
    $("#show-information").on("change", (event) => {
      this.render();
    });
  }

  place(tilePosition) {
    let result = this.tsuro.place(this.rotation, tilePosition);
    if (result) {
      this.rotation = 0;
    }
    this.render();
  }

  rotate() {
    this.rotation = (this.rotation + 1) % 4;
    this.render();
  }

  hover(tilePosition) {
    this.hoveredTilePosition = tilePosition;
    this.render();
  }

  undo() {
    let result = this.tsuro.undo();
    if (result) {
      this.rotation = 0;
    }
    this.render();
  }

  redo() {
    let result = this.tsuro.redo();
    if (result) {
      this.rotation = 0;
    }
    this.render();
  }

  render() {
    this.renderTiles();
    this.renderStones();
    this.renderHoveredTile();
    this.renderPlaceableTilePositions();
    this.renderInformation();
    this.renderNextHand();
    this.renderNextHandInformation();
    this.renderRemainingHands();
    this.renderRemainingHandSize();
    this.renderButtons();
    this.renderRecord();
  }

  renderTiles() {
    let tiles = this.tsuro.board.tiles;
    for (let i = 0 ; i < tiles.length ; i ++) {
      let tile = tiles[i];
      let tileDiv = $("#board #tile-" + i);
      tileDiv.empty();
      if (tile) {
        let tileTextureDiv = $("<div>");
        tileTextureDiv.attr("class", "background");
        tileTextureDiv.css("background-image", "url(\"image/" + (tile.number + 1) + ".png\")");
        tileTextureDiv.css("transform", "rotate(" + (tile.rotation * 90) + "deg)");
        tileDiv.append(tileTextureDiv);
      }
    }
  }

  renderRemainingHands() {
    let remainingHands = this.tsuro.remainingHands;
    for (let i = 0 ; i < 35 ; i ++) {
      let tileDiv = $("#remaining #tile-" + i);
      tileDiv.empty();
    }
    if ($("#show-remaining").is(":checked")) {
      for (let tile of remainingHands) {
        let tileDiv = $("#remaining #tile-" + tile.number);
        let tileTextureDiv = $("<div>");
        tileTextureDiv.attr("class", "background");
        tileTextureDiv.css("background-image", "url(\"image/" + (tile.number + 1) + ".png\")");
        tileTextureDiv.css("transform", "rotate(" + (tile.rotation * 90) + "deg)");
        tileDiv.append(tileTextureDiv);
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
      stoneDiv.css("top", (top + 50) + "px");
      stoneDiv.css("left", (left + 50) + "px");
    }
  }

  renderHoveredTile() {
    let tile = this.tsuro.nextHand;
    if (tile) {
      let tilePosition = this.hoveredTilePosition;
      let tileDiv = $("#board #tile-" + tilePosition);
      let tileTextureDiv = $("<div>");
      tileTextureDiv.attr("class", "background hover");
      tileTextureDiv.css("background-image", "url(\"image/" + (tile.number + 1) + ".png\")");
      tileTextureDiv.css("transform", "rotate(" + (this.rotation * 90) + "deg)");
      tileDiv.append(tileTextureDiv);
    }
  }

  renderPlaceableTilePositions() {
    if ($("#show-suggest").is(":checked")) {
      let tilePositions = this.tsuro.placeableTilePositions(this.rotation);
      for (let tilePosition of tilePositions) {
        let tileDiv = $("#board #tile-" + tilePosition);
        let highlightDiv = $("<div>");
        highlightDiv.attr("class", "highlight");
        tileDiv.append(highlightDiv);
      }
    }
    if ($("#show-mask").is(":checked") && !this.tsuro.isPlaceable() && this.tsuro.remainingHandSize > 0) {
      $("#mask").css("display", "flex");
    } else {
      $("#mask").css("display", "none");
    }
  }

  renderInformation() {
    if ($("#show-information").is(":checked")) {
      for (let entry of this.tsuro.record.entries) {
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

  renderNextHand() {
    let tile = this.tsuro.nextHand;
    let tileDiv = $("#next-tile");
    tileDiv.empty();
    if (tile) {
      let tileTextureDiv = $("<div>");
      tileTextureDiv.attr("class", "background");
      tileTextureDiv.css("background-image", "url(\"image/" + (tile.number + 1) + ".png\")");
      tileTextureDiv.css("transform", "rotate(" + (this.rotation * 90) + "deg)");
      tileDiv.append(tileTextureDiv);
    }
  }

  renderNextHandInformation() {
    if ($("#show-information").is(":checked")) {
      let tile = this.tsuro.nextHand;
      let tileDiv = $("#next-tile");
      if (tile) {
        let tileInformationDiv = $("<div>");
        let tileNumber = tile.number;
        let rotation = ROTATION_SYMBOLS[this.rotation % tile.symmetry];
        let string = tileNumber + rotation;
        tileInformationDiv.attr("class", "information");
        tileInformationDiv.html(string);
        tileDiv.append(tileInformationDiv);
      }
    }
  }

  renderRemainingHandSize() {
    let remainingHandSize = this.tsuro.remainingHandSize;
    let remainingHandSizeDiv = $("#remaining-size");
    remainingHandSizeDiv.text(remainingHandSize);
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

  renderRecord() {
    $("#history").val(this.tsuro.record.toString(false));
  }

  tweet() {
    let string = this.tsuro.record.toString(false);
    let elapsedTime = this.tsuro.elapsedTime;
    let minute = ("0" + Math.floor(elapsedTime / 60)).slice(-2);
    let second = ("0" + (elapsedTime % 60)).slice(-2);
    let url = location.protocol + "//" + location.host + location.pathname;
    let option = "width=" + TWITTER_WIDTH + ",height=" + TWITTER_HEIGHT + ",menubar=no,toolbar=no,scrollbars=no";
    let href = "https://twitter.com/intent/tweet";
    url += "?q=" + encodeURIComponent(string);
    href += "?text=" + TWITTER_MESSAGE.replace(/%t/g, minute + ":" + second);
    href += "&url=" + encodeURIComponent(url);
    href += "&hashtags=" + TWITTER_HASHTAG;
    window.open(href, "_blank", option);
  }

}


let executor = new Executor();
$(() => {
  executor.prepare();
});