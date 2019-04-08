//


class RecordEntry {

  constructor(count, type, tile, tilePosition, round, withdrawn = false) {
    this.count = count;
    this.type = type;
    this.tile = tile;
    this.withdrawn = withdrawn;
    this.tilePosition = tilePosition;
    this.round = round;
  }

  toString(short) {
    let string = "";
    if (this.type == 1) {
      string += "Undo";
    } else if (this.type == 2) {
      string += "Redo";
    } else {
      if (!short) {
        string += (this.round + 1) + ": ";
      }
      let row = ROW_SYMBOLS[Math.floor(this.tilePosition / 6)];
      let column = COLUMN_SYMBOLS[this.tilePosition % 6];
      let tile = this.tile.toString();
      string += row + column + tile;
      if (this.withdrawn) {
        string += "*";
      }
    }
    if (!short) {
      if (this.count != null) {
        let minute = ("0" + Math.floor(this.count / 60)).slice(-2);
        let second = ("0" + (this.count % 60)).slice(-2);
        string = string + " [" + minute + ":" + second + "]";
      }
    }
    return string;
  }

  action(tsuro) {
    if (this.type == 0 && !this.withdrawn) {
      tsuro.dealer.nextTile = this.tile;
      tsuro.nextTile = this.tile;
      let result = tsuro.place(this.tilePosition);
      if (!result) {
        throw new Error("Invalid Move");
      }
    } else if (this.type == 1) {
      tsuro.undo();
    } else if (this.type == 2) {
      tsuro.redo();
    }
  }

}


class Record {

  constructor() {
    this.entries = [];
  }

  place(tile, tilePosition, round, count, withdrawn = false) {
    let entry = new RecordEntry(count, 0, tile, tilePosition, round, withdrawn);
    this.entries.push(entry);
  }

  undo(count) {
    let entry = new RecordEntry(count, 1);
    this.entries.push(entry);
  }

  redo(count) {
    let entry = new RecordEntry(count, 2);
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

  play(tsuro) {
    for (let entry of this.entries) {
      entry.action(tsuro);
    }
  }

  static parse(string) {
    let record = new Record();
    let regexp = new RegExp(RECORD_REGEXP, "g");
    let match;
    while ((match = regexp.exec(string)) != null) {
      if (match[0] != undefined) {
        let count = (match[8] != undefined) ? parseInt(match[8]) * 60 + parseInt(match[9]) : null;
        if (match[1] == "Undo") {
          record.undo(count);
        } else if (match[1] == "Redo") {
          record.redo(count);
        } else {
          let round = parseInt(match[2]) - 1;
          let row = ROW_SYMBOLS.indexOf(match[3]);
          let column = COLUMN_SYMBOLS.indexOf(match[4]);
          let tilePosition = row * 6 + column;
          let number = parseInt(match[5]);
          let rotation = ROTATION_SYMBOLS.indexOf(match[6]);
          let withdrawn = !!match[7];
          if (0 <= tilePosition && tilePosition < 36 && number < TILES.length && rotation >= 0) {
            let tile = TILES[number].rotate(rotation);
            record.place(tile, tilePosition, round, count, withdrawn);
          } else {
            throw new Error("Invalid Record");
          }
        }
      }
    }
    return record;
  }

}