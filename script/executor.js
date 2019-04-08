//


class Executor {

  load(seed = "", recordString = "") {
    this.sequence = new Sequence(seed, recordString);
    this.render();
    $("#newgame-dialogue").addClass("hidden");
  }

  init() {
    let seed = "";
    let recordString = "";
    let pairs = location.search.substring(1).split("&");
    for (let pair of pairs) {
      let match;
      if ((match = pair.match(/q=(.+)/)) != null) {
        recordString = decodeURIComponent(match[1]);
      }
      if ((match = pair.match(/s=(.+)/)) != null) {
        seed = decodeURIComponent(match[1]);
      }
    }
    this.load(seed, recordString);

    let settings = localStorage.getItem("tsuroSettings");
    if (settings) {
      settings = JSON.parse(settings);
      $("#show-timer").prop("checked", settings.showTimer);
      $("#show-suggest").prop("checked", settings.showSuggest);
      $("#show-deck").prop("checked", settings.showDeck);
      $("#show-queue").prop("checked", settings.showQueue);
      $("#show-history").prop("checked", settings.showHistory);
      $("#show-result").prop("checked", settings.showResult);
      $("#show-information").prop("checked", settings.showInformation);
    } else {
      $("#show-timer").prop("checked", true);
      $("#show-suggest").prop("checked", true);
      $("#show-deck").prop("checked", true);
      $("#show-queue").prop("checked", true);
      $("#show-history").prop("checked", true);
      $("#show-result").prop("checked", true);
      $("#show-information").prop("checked", false);
    }
    this.applySettings();
  }

  prepare() {
    this.prepareTiles();
    this.prepareStones();
    this.prepareNextTile();
    this.prepareDeck();
    this.prepareTimer();
    this.prepareEvents();
    this.init();
    this.render();
  }

  prepareTiles() {
    let tilesTable = $("#tiles");
    for (let row = 0 ; row < 6 ; row ++) {
      let tr = $("<tr>")
      for (let column = 0 ; column < 6 ; column ++) {
        let tilePosition = row * 6 + column;
        let td = $("<td>");
        td.attr("class", "cell");

        let baseDiv = $("<div>");
        baseDiv.attr("class", "base");
        if ((row + column) % 2 == 0) {
          baseDiv.addClass("alternative");
        }
        td.append(baseDiv);

        let suggestDiv = $("<div>");
        suggestDiv.attr("class", "suggest");
        suggestDiv.attr("id", "suggest-" + tilePosition);
        td.append(suggestDiv);

        let tileDiv = $("<div>");
        tileDiv.attr("class", "tile");
        tileDiv.attr("id", "tile-" + tilePosition);
        tileDiv.on("mousedown", (event) => {
          if (event.button == 0) {
            this.place(tilePosition);
          } else if (event.button == 2) {
            this.rotate();
          }
        });
        tileDiv.on("contextmenu", (event) => {
          event.preventDefault();
        });
        tileDiv.on("mouseenter", (event) => {
          this.hover(tilePosition);
        });
        tileDiv.on("mouseleave", (event) => {
          this.hover(null);
        });
        td.append(tileDiv);

        let informationDiv = $("<div>");
        informationDiv.attr("class", "information");
        informationDiv.attr("id", "information-" + tilePosition);
        informationDiv.css("pointer-events", "none");
        td.append(informationDiv);

        tr.append(td);
      }
      tilesTable.append(tr);
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
      tileDiv.attr("id", "decktile-" + i);
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
    let nextDiv = $("#next");
    nextDiv.on("mousedown", (event) => {
      this.rotate();
    });
    nextDiv.on("contextmenu", (event) => {
      event.preventDefault();
    });
  }

  prepareTimer() {
    setInterval(() => {
      let count = this.sequence.tsuro.timer.count;
      let minute = (count != null) ? ("0" + Math.floor(count / 60)).slice(-2) : "  ";
      let second = (count != null) ? ("0" + (count % 60)).slice(-2) : "  ";
      if ($("#minute").text() != minute) {
        $("#minute").text(minute);
      }
      if ($("#second").text() != second) {
        $("#second").text(second);
      }
    }, 50);
  }

  prepareEvents() {
    $("[readonly]").on("click", (event) => {
      event.target.select();
    });
    $(".modal").on("click", (event) => {
      this.closeAnyDialogue();
    });
    $(".modal").children().on("click", (event) => {
      event.stopPropagation();
    });
    $(".closer").on("click", (event) => {
      this.closeAnyDialogue();
    });
    $("#newgame-button").on("click", (event) => {
      $("#load-seed").val(Math.floor(Math.random() * 4294967296));
      $("#load-record").val("");
      $("#newgame-dialogue").removeClass("hidden");
    });
    $("#settings-button").on("click", (event) => {
       $("#settings-dialogue").removeClass("hidden");
    });
    $("#share-button").on("click", (event) => {
       $("#share-dialogue").removeClass("hidden");
    });
    $("#undo-button").on("click", (event) => {
      this.undo();
    });
    $("#redo-button").on("click", (event) => {
      this.redo();
    });
    $("#gamestart-button").on("click", (event) => {
      this.load($("#load-seed").val(), $("#load-record").val());
    });
    $("#show-timer").on("change", (event) => {
      this.applySettings();
    });
    $("#show-suggest").on("change", (event) => {
      this.applySettings();
    });
    $("#show-deck").on("change", (event) => {
      this.applySettings();
    });
    $("#show-queue").on("change", (event) => {
      this.applySettings();
    });
    $("#show-history").on("change", (event) => {
      this.applySettings();
    });
    $("#show-result").on("change", (event) => {
      this.applySettings();
    });
    $("#show-information").on("change", (event) => {
      this.applySettings();
    });
    $("#tweet").on("click", (event) => {
      this.tweet();
    });
    $("#next-combo-button").on("click", (event) => {
      this.startNextCombo();
    });
  }

  applySettings() {
    if ($("#show-timer").prop("checked")) {
      $("#timer-card").removeClass("hidden");
    } else {
      $("#timer-card").addClass("hidden");
    }
    if ($("#show-suggest").prop("checked")) {
      $(".suggest").removeClass("hidden");
    } else {
      $(".suggest").addClass("hidden");
    }
    if ($("#show-deck").prop("checked")) {
      $("#deck-wrapper").removeClass("hidden");
    } else {
      $("#deck-wrapper").addClass("hidden");
    }
    if ($("#show-queue").prop("checked")) {
      $("#queue-wrapper").removeClass("hidden");
    } else {
      $("#queue-wrapper").addClass("hidden");
    }
    if ($("#show-history").prop("checked")) {
      $("#history-card").removeClass("hidden");
    } else {
      $("#history-card").addClass("hidden");
    }
    if ($("#show-information").prop("checked")) {
      $(".information").removeClass("hidden");
    } else {
      $(".information").addClass("hidden");
    }
    this.render();
    localStorage.setItem("tsuroSettings", JSON.stringify({
      showTimer: $("#show-timer").prop("checked"),
      showSuggest: $("#show-suggest").prop("checked"),
      showDeck: $("#show-deck").prop("checked"),
      showQueue: $("#show-queue").prop("checked"),
      showHistory: $("#show-history").prop("checked"),
      showResult: $("#show-result").prop("checked"),
      showInformation: $("#show-information").prop("checked")
    }));
  }

  place(tilePosition) {
    this.sequence.tsuro.place(tilePosition);
    this.render();
  }

  rotate() {
    this.sequence.tsuro.rotateNextTile();
    this.render();
  }

  hover(tilePosition) {
    this.hoveredTilePosition = tilePosition;
    this.render();
  }

  undo() {
    this.sequence.tsuro.undo();
    this.render();
  }

  redo() {
    this.sequence.tsuro.redo();
    this.render();
  }

  jumpTo(round) {
    let result = this.sequence.tsuro.jumpTo(round);
    this.render();
  }

  render() {
    this.renderTiles();
    this.renderStones();
    this.renderSuggest();
    this.renderInformation();
    this.renderResult();
    this.renderNextTile();
    this.renderRest();
    this.renderDeck();
    this.renderQueue();
    this.renderLapTimes();
    this.renderHistory();
    this.renderButtons();
    this.renderShareData();
  }

  renderTiles() {
    let tiles = this.sequence.tsuro.board.tiles;
    let nextTile = this.sequence.tsuro.nextTile;
    for (let i = 0 ; i < tiles.length ; i ++) {
      let tile = tiles[i];
      let tileDiv = $("#tile-" + i);
      tileDiv.empty();
      tileDiv.removeClass("hover");
      if (tile) {
        tileDiv.css("background-image", "url(\"image/" + (tile.number + 1) + ".png\")");
        tileDiv.css("transform", "rotate(" + (tile.rotation * 90) + "deg)");
      } else if (!this.sequence.tsuro.isGameclear() && i == this.hoveredTilePosition) {
        tileDiv.addClass("hover");
        tileDiv.css("background-image", "url(\"image/" + (nextTile.number + 1) + ".png\")");
        tileDiv.css("transform", "rotate(" + (nextTile.rotation * 90) + "deg)");
      } else {
        tileDiv.css("background-image", "none");
      }
    }
  }

  renderStones() {
    let stones = this.sequence.tsuro.stones;
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
    let suggestPositions = this.sequence.tsuro.getSuggestPositions();
    for (let i = 0 ; i < 36 ; i ++) {
      $("#suggest-" + i).removeClass("suggest");
    }
    for (let position of suggestPositions) {
      $("#suggest-" + position).addClass("suggest");
    }
  }

  renderResult() {
    if ($("#show-result").prop("checked") && this.sequence.tsuro.isGameover()) {
      $("#gameover").removeClass("hidden");
    } else {
      $("#gameover").addClass("hidden");
    }
    if ($("#show-result").prop("checked") && this.sequence.tsuro.isGameclear()) {
      $("#gameclear").removeClass("hidden");
      if(this.sequence.tsuro.timer.count) {
        $("#next-combo-button-wrapper").removeClass("hidden");
      } else {
        $("#next-combo-button-wrapper").addClass("hidden");
      }
    } else {
      $("#gameclear").addClass("hidden");
    }
  }

  renderInformation() {
    for (let i=0; i<36; i++) {
      $("#information-" + i).empty();
    }
    for (let entry of this.sequence.tsuro.history.entries.slice(0, this.sequence.tsuro.history.current + 1)) {
      if (entry.tilePosition) {
        let informationDiv = $("#information-" + entry.tilePosition);
        informationDiv.html((entry.round + 1) + ":<br>" + entry.toString(true));
      }
    }
  }

  renderNextTile() {
    let nextTile = this.sequence.tsuro.nextTile;
    let tileDiv = $("#next-tile");
    let tileInformationDiv = $("#next-information");
    if (nextTile) {
      tileDiv.css("background-image", "url(\"image/" + (nextTile.number + 1) + ".png\")");
      tileDiv.css("transform", "rotate(" + (nextTile.rotation * 90) + "deg)");
    }
    if (nextTile) {
      tileInformationDiv.html(nextTile.toString());
    }
  }

  renderDeck() {
    let deck = this.sequence.tsuro.dealer.deck;
    for (let i = 0 ; i < 35 ; i ++) {
      let tileDiv = $("#deck #decktile-" + i);
      tileDiv.empty();
    }
    for (let tile of deck) {
      let tileDiv = $("#deck #decktile-" + tile.number);
      let tileTextureDiv = $("<div>");
      tileTextureDiv.attr("class", "texture");
      tileTextureDiv.css("background-image", "url(\"image/" + (tile.number + 1) + ".png\")");
      tileTextureDiv.css("transform", "rotate(" + (tile.rotation * 90) + "deg)");
      tileDiv.append(tileTextureDiv);
    }
  }

  renderQueue() {
    let queue = this.sequence.tsuro.dealer.queue;
    let round = this.sequence.tsuro.dealer.round;
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
    queueDiv.children().eq(round).addClass("next");
  }

  renderLapTimes() {
    let lapsUl = $("#laps");
    lapsUl.empty();
    for (let lap of this.sequence.laps) {
      let minute = ("0" + Math.floor(lap / 60)).slice(-2);
      let second = ("0" + (lap % 60)).slice(-2);
      let lapLi = $("<li>");
      lapLi.html(minute + ":" + second);
      lapsUl.append(lapLi);
    }
  }

  renderHistory() {
    let entries = this.sequence.tsuro.history.entries;
    let round = this.sequence.tsuro.dealer.round;
    let historyUl = $("#history");
    historyUl.empty();
    for (let entry of entries) {
      historyUl.append(entry.toHTML());
    }
    let currentLi = historyUl.children().eq(round)
    currentLi.addClass("current");
    // current 要素を history の上から 10px の位置に表示るようスクロール
    historyUl.scrollTop(historyUl.scrollTop() + currentLi.position().top - 10);
  }

  renderRest() {
    let restRound = 35 - this.sequence.tsuro.dealer.round;
    let restRoundDiv = $("#rest-round");
    restRoundDiv.text(restRound);
  }

  renderButtons() {
    if (this.sequence.tsuro.canUndo()) {
      $("#undo-button").attr("class", "");
    } else {
      $("#undo-button").attr("class", "disabled")
    }
    if (this.sequence.tsuro.canRedo()) {
      $("#redo-button").attr("class", "");
    } else {
      $("#redo-button").attr("class", "disabled")
    }
  }

  renderShareData() {
    $("#share-record").val(this.sequence.tsuro.record.toString(false));
    $("#share-seed").val(this.sequence.tsuro.seed);
    $("#share-link").val(this.generateURL());
  }

  closeAnyDialogue() {
    $("#newgame-dialogue").addClass("hidden");
    $("#settings-dialogue").addClass("hidden");
    $("#share-dialogue").addClass("hidden");
  }

  tweet() {
    let count = this.sequence.tsuro.timer.count;
    let minute = ("0" + Math.floor(count / 60)).slice(-2);
    let second = ("0" + (count % 60)).slice(-2);
    let url = this.generateURL();
    let option = "width=" + TWITTER_WIDTH + ",height=" + TWITTER_HEIGHT + ",menubar=no,toolbar=no,scrollbars=no";
    let href = "https://twitter.com/intent/tweet";
    href += "?text=" + TWITTER_MESSAGE.replace(/%t/g, minute + ":" + second);
    href += "&url=" + encodeURIComponent(url);
    href += "&hashtags=" + TWITTER_HASHTAG;
    window.open(href, "_blank", option);
  }

  generateURL() {
    return location.protocol + "//" + location.host + location.pathname + "?s=" + this.sequence.tsuro.seed + "&q=" + encodeURIComponent(this.sequence.tsuro.record.toString(false));
  }

}
