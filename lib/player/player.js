/**
 * @file プレイヤーに関する情報を定義する。
 */

/**
 * プレイヤークラス。
 * @param {!string} name プレイヤー名
 * @param {!*} ai AI
 */
var Player = function(name, ai) {
  /**
   * @type {!string} プレイヤー名。
   */
  this.name = name;

  /**
   * @type {!*} AI 。
   */
  this.ai = ai;

  /**
   * @type {!Hand} 手札。
   */
  this.hand = new Hand();

  /**
   * @type {!playArea} プレイエリア。
   */
  this.playArea = new PlayArea();

  /**
   * @type {!DiscardPile} 捨て札。
   */
  this.discardPile = new DiscardPile();

  /**
   * @type {!Deck} デッキ。
   */
  this.deck = new Deck();

  /**
   * @type {!number} コイン数。
   */
  this.coinNum = 0;

  /**
   * @type {!number} アクション数。
   */
  this.actionNum = 0;

  /**
   * @type {!number} 購入数。
   */
  this.buyNum = 0;

  /**
   * @type {!Player.PHASE} 現在のフェーズ(アクションフェーズ、購入フェーズなど)。
   */
  this.phase = Player.PHASE.ACTION;

  /**
   * @type {!number} 現在のターン数
   */
  this.turnNum = 0;

  /**
   * @type {!TaskControlar} ターン開始時タスク。
   */
  this.turnStartTaskControlar = new TaskControlar();


  /**
   * @type {!PlayLogger} プレイロガー。
   */
  this.playLogger = new PlayLogger(this.name);

  /**
   * ゲームを始めるための前処理を行う。
   * (初期デッキを設定し、5枚ドローする。)
   * @param {!Cards} cards カードの束
   * @param {!boolean} shuffle_enabled シャッフルするか
   */
  this.prepareGame = function(cards, shuffle_enabled) {
    // シャッフルしない場合、設定順にドローするように逆順にする。
    cards.reverse();
    this.deck.pushCards(cards);
    if(shuffle_enabled === true) {
      this.shuffleWithDiscardPile();
    }
    this.draw(5);
  }

  /**
   * フェーズを設定する。
   * @param {!Player.PHASE} phase フェーズ(Player.PHASE.ACTIONなど)
   */
  this.setPhase = function(phase) {
    this.phase = phase;
  }

  /**
   * アクション数を加算する。
   * @param {!number} num アクション数(負の数も可)
   */
  this.addAction = function(num) {
    this.actionNum += num;
  }

  /**
   * コイン数を加算する。
   * @param {!number} num コイン数(負の数も可)
   */
  this.addCoin = function(num) {
    this.coinNum += num;
  }

  /**
   * 購入数を加算する。
   * @param {!number} num コイン数(負の数も可)
   */
  this.addBuy = function(num) {
    this.buyNum += num;
  }

  /**
   * 指定したカードを手札に持っているか。
   * @param {!Card.NAME} cardName カード名
   * @returns 持っている場合true、そうでない場合false
   */
  this.hasCard = function(cardName) {
    return this.hand.has(cardName);
  }

  /**
   * 指定カード名のカードがデッキに何枚存在するかを返却する。
   * @param {!string} cardName
   * @returns デッキ内の枚数
   */
  this.countByCardNameInDeck = function(cardName) {
    return this.deck.countByCardName(cardName)
      + this.hand.countByCardName(cardName)
      + this.discardPile.countByCardName(cardName)
      + this.playArea.countByCardName(cardName);
  }

  /**
   * デッキ内のカードのカード名を配列で取得する。
   * カードが重複している場合、重複している枚数だけ要素に格納する。
   * ※デッキ枚数 = 返却配列の要素数
   * @returns {Array<string>} カード名の配列
   */
  this.getCardNamesInDeck = function() {
    return this.deck.getCardNames()
      .concat(this.hand.getCardNames())
      .concat(this.discardPile.getCardNames())
      .concat(this.playArea.getCardNames());
  }

  /**
   * デッキ内のカード毎の枚数を取得する。
   * @returns {Object} key:カード名、val:枚数の連想配列
   */
  this.countCardNumInDeck = function() {
    return this.getCardNamesInDeck().countItemNum();
  }

  /**
   * デッキの上から指定枚数カードをとる。
   * 指定枚数がデッキに存在しない場合は、捨て札を混ぜシャッフルする。
   * それでも指定枚数に満たない場合は、とれた枚数分だけを返却する。
   * @param {!number} num 取得する枚数
   * @returns {Array<Card>} カードの配列
   */
  this.popCardsFromDeck = function(num) {
    var cards = new Cards();
    if(this.needShuffle(num) === true) {
      var diff = num - this.deck.count();
      cards.pushCards(this.deck.popAll());
      this.shuffleWithDiscardPile();
      cards.pushCards(this.deck.popMulti(diff));
    }
    else {
      cards.pushCards(this.deck.popMulti(num));
    }
    return cards;
  }

  /**
   * シャッフルが必要か判定する。
   * 「指定枚数がデッキに存在しない、かつ捨て札にカードが存在する」場合に
   * シャッフルが必要であると判断する。
   * @param {!number} num 枚数
   * @returns {boolean} シャッフルが必要ならばtrue、そうでないならばfalse。
   */
  this.needShuffle = function(num) {
    if(this.deck.count() < num && this.discardPile.isEmpty() === false) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * カードを指定枚数ドローする。
   * 枚数が足りない場合、捨て札を混ぜシャッフルする。
   * それでも枚数が足りない場合、ドローできた数だけを返却する。
   * @param {!number} num ドロー枚数
   */
  this.draw = function(num) {
    var cards = this.popCardsFromDeck(num);
    this.playLogger.log("draws", cards.getCardNames());
    this.hand.pushCards(cards);
  }

  /**
   * 捨て札を混ぜ、デッキをシャッフルする。
   */
  this.shuffleWithDiscardPile = function() {
    this.deck.pushCards(this.discardPile.popAll());
    this.shuffleDeck();
  }

  /**
   * デッキをシャッフルする。
   */
  this.shuffleDeck = function() {
    this.playLogger.log("shuffles");
    this.deck.shuffle();
  }

  /**
   * 指定カードのプレイを試みる。
   * プレイ可能ならばそのカードをプレイし、trueを返す。
   * プレイ不可だった場合は、falseを返す。
   * @param {!string} cardName カード名
   * @param {!*} obj カードプレイ時のコールバックオブジェクト
   * @returns カードをプレイできた場合はtrue、そうでない場合はfalse
   */
  this.tryPlayCard = function(cardName, obj) {
    switch(this.phase) {
    case Player.PHASE.ACTION:
      return this.tryPlayAction(cardName, obj);
    case Player.PHASE.TREASURE:
      // 現状未実装
    default:
      // 処理なし
    }
    return false;
  }

  /**
   * 指定カードをアクションとしてプレイを試みる。
   * プレイ可能ならばそのカードをプレイし、trueを返す。
   * プレイ不可だった場合は、falseを返す。
   * @param {!string} cardName カード名
   * @param {!*} obj カードプレイ時のコールバックオブジェクト
   * @returns カードをプレイできた場合はtrue、そうでない場合はfalse
   */
  this.tryPlayAction = function(cardName, obj) {
    if(this.canPlayAction(cardName) === false) {
      return false;
    }
    this.addAction(-1);
    this.playAction(cardName, obj);
    return true;
  }

  /**
   * 指定カードをプレイ可能か判定する。
   * @param {!string} cardName カード名
   * @returns プレイ可能な場合true、そうでない場合false
   */
  this.canPlayAction = function(cardName) {
    return (this.hand.has(cardName) && this.actionNum > 0);
  }

  /**
   * 指定アクションカードをプレイする。
   * @param {!string} cardName カード名
   * @param {!*} obj カードプレイ時のコールバックオブジェクト
   */
  this.playAction = function(cardName, obj) {
    var card = this.hand.popByName(cardName);
    this.playLogger.log("plays", card.name);
    this.playCard(card, obj);
  }

  /**
   * 指定カードをプレイし、プレイエリアに配置する。
   * @param {!Card} card カード
   * @param {!*} obj カードプレイ時のコールバックオブジェクト
   */
  this.playCard = function(card, obj) {
    card.play(this, obj);
    this.playArea.push(card);
  }

  /**
   * 手札の財宝カードをすべてプレイする。
   * 手札に財宝カードが存在しない場合、何もしない。
   */
  this.playAllTreasure = function() {
    var cards = this.hand.popAllByCardType(Card.TYPE.TREASURE);
    if(cards.isEmpty() === true) {
      return;
    }

    this.playLogger.log("plays", cards.getCardNames());
    var self = this;
    cards.array.each(function(card) {
      self.playCard(card);
    });
    this.playLogger.log("coins", this.coinNum);
  }

  /**
   * カードを獲得する。
   * @param {!Card} card カード
   */
  this.gain = function(card) {
    this.playLogger.log("gains", card.name);
    this.discardPile.push(card);
  }

  /**
   * 指定カードを購入可能な場合、購入する。
   * @param {!string} cardName カード名
   * @returns 購入した場合true、それ以外の場合false
   */
  this.tryBuy = function(cardName) {
    if(this.canBuy(cardName) === false) {
      return false;
    }
    this.buy(cardName);
    return true;
  }


  /**
   * 指定カードを購入する。
   * 指定カードは購入できない状態での動作は未定義。
   * @param {!string} cardName カード名
   */
  this.buy = function(cardName) {
    var card = board.supply.popSupplyCard(cardName);
    this.playLogger.log("buys", card.name);
    this.addCoin(-card.getCost().coin);
    this.addBuy(-1);
    this.gain(card);
  }

  /**
   * 指定カードを購入可能か判定する。
   * @param {!string} cardName カード名
   * @returns 購入可能な場合true、そうでない場合false
   */
  this.canBuy = function(cardName) {
    var card = board.supply.getTopSupplyCard(cardName);;
    if(card === null || this.coinNum < card.getCost().coin) {
      return false;
    }
    else {
      return true;
    }
  }

  /**
   * 手札をすべて捨てる。
   */
  this.discardAll = function() {
    this.discardPile.pushCards(this.hand.popAll());
  }

  /**
   * 指定したカードを手札からデッキの上に置く。
   * nullが指定される、もしくは指定したカードが手札に存在しない場合は、一番右のカードを置く。
   * @param {string} cardName
   */
  this.putCardFromHandOntoDeck = function(cardName) {
    var card = this.hand.popByName(cardName);
    if(card == null) {
      card = this.hand.pop();
    }
    this.playLogger.log("puts onto deck", card.name)
    this.deck.push(card);
  }

  /**
   * プレイヤーの状態を初期値に戻す。
   */
  this.reset = function() {
    this.coinNum = 0;
    this.actionNum = 1;
    this.buyNum = 1;
    this.phase = Player.PHASE.ACTION;
  }

  /**
   * ターン開始時の処理を行う。
   */
  this.processTurnStart = function() {
    this.turnStartTaskControlar.executeTasks(this);
  }

  /**
   * アクションフェーズでの処理を行う。
   */
  this.processActionPhase = function() {
    if(this.actionNum <= 0) {
      this.setPhase(Player.PHASE.BUY);
      return;
    }
    var ret = this.ai.processActionPhase(this);
    if(ret === false
      || this.actionNum <= 0
      || this.hand.countByCardType(Card.TYPE.ACTION) <= 0) {
      this.setPhase(Player.PHASE.BUY);
    }
  }

  /**
   * 購入フェーズ時の処理を行う。
   */
  this.processBuyPhase = function() {
    if(this.buyNum <= 0) {
      this.setPhase(Player.PHASE.CLEAN_UP);
      return;
    }
    var ret = this.ai.processBuyPhase(this);
    if(ret === false || this.buyNum <= 0) {
      this.setPhase(Player.PHASE.CLEAN_UP);
    }
  }

  /**
   * クリーンアップフェイズでの処理を行う。
   */
  this.processCleanUpPhase = function() {
    this.discardAll();

    this.discardPile.pushCards(this.playArea.popAllByFunc(function(card) {
      return card.is_durational === false;
    }));
    this.draw(5);
  }

  /**
   * 1ターンの処理を行う。
   */
  this.processTurn = function() {

    // ターン数を加算
    this.turnNum++;

    this.playLogger.turnCountUp();
    logger.log3("");
    this.playLogger.log("turn " + this.turnNum);
    this.playLogger.log("hand", this.hand.getCardNames().join(", "));

    // 状態リセット
    this.reset();

    // ターン開始時処理
    this.processTurnStart();

    // ヴィラを意識した実装だが、ヴィラを実装予定は今のところない
    do {
      switch(this.phase) {
      case Player.PHASE.ACTION:
        // アクションフェーズ
        this.processActionPhase();
        break;
      case Player.PHASE.BUY:
        // 購入フェーズ
        this.processBuyPhase();
        break;
      default:
        // ここを通過する想定はないため、ループを抜けるようにする。
        this.setPhase(Player.PHASE.CLEAN_UP);
      }
    } while(this.phase !== Player.PHASE.CLEAN_UP);

    this.playLogger.log("play area", this.playArea.getCardNames().join(", "));
    this.playLogger.log("deck num", this.deck.count());
    this.playLogger.log("action num", this.actionNum);

    // クリーンアップフェーズ
    this.processCleanUpPhase();

    // 状態リセット
    this.reset();
  }

  /**
   * デッキの内容をログ出力する。
   */
  this.logDeck = function() {
    var hash = this.countCardNumInDeck();
    var tmp = [];
    for(key in hash) {
      tmp.push(key + "(" + hash[key] + ")");
    }
    logger.log2([this.name, this.turnNum + "turns"].concat(tmp).join(", "));
  };

  /**
   * ターン開始時のタスクを登録する。
   * @param {!Task} task タスク
   */
  this.addTurnStartTask = function(task) {
    this.turnStartTaskControlar.addTask(task);
  }
}

/**
 * @enum {!string} フェーズ。
 */
Player.PHASE = {
  ACTION: "ACTION",
  BUY: "BUY",
  CLEAN_UP: "CLEAN_UP"
}