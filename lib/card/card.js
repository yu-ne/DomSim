/**
 * @file カードに関する情報を定義する。
 */

/**
 * コストクラス。
 * @param {!number} coin コイン
 * @param {!number} portion ポーション
 * @param {!number} debt 負債
 */
var Cost = function(coin, portion, debt) {
  this.coin = coin;
  this.portion = portion;
  this.debt = debt;
}

/**
 * カードクラス。
 * @param {!CardDbRecord} obj カードオブジェクト
 * @constructor
 */
function Card(obj) {
  this.name = obj.name;
  this.types = obj.types;
  this.cost = obj.cost;
  this.victoryPoint = obj.victoryPoint;
  /**
   * @type {!boolean} 場に持続するか
   */
  this.is_durational = false;

  /**
   * 指定したカード名のカードであるか判定する。
   * @param {!string} name カード名
   * @returns {boolean} 一致したか
   */
  this.is = function(name) {
    return this.name === name;
  }

  /**
   * コストを取得する。
   * @returns {Cost} コスト
   */
  this.getCost = function() {
    return this.cost;
  }

  /**
   * 勝利点を取得する。
   * 勝利点が動的に変化するカードの場合は、
   * 当該メソッドを継承してオーバーロードすること。
   * @returns {number} 勝利点
   */
  this.getVictoryPoint = function() {
    return this.victoryPoint;
  }
}

/**
 * @enum {!string} カード名を定義する。
 */
Card.NAME = {
  GOLD: "GOLD",
  SILVER: "SILVER",
  COPPER: "COPPER",
  PROVINCE: "PROVINCE",
  DUCHY: "DUCHY",
  ESTATE: "ESTATE",
  PLATINUM: "PLATINUM",
  COLONY: "COLONY",
  SMITHY: "SMITHY",
  SCHOLAR: "SCHOLAR",
  LABORATORY: "LABORATORY",
  MARKET: "MARKET",
  FESTIVAL: "FESTIVAL",
  SAUNA: "SAUNA",
  AVANTO: "AVANTO",
  HIRELING: "HIRELING",
  PIRATE: "PIRATE"
}

/**
 * @enum {!string} カードの種類を定義する。
 */
Card.TYPE = {
  ACTION: "ACTION",
  VICTORY: "VICTORY",
  TREASURE: "TREASURE",
  DURATION: "DURATION"
}

/**
 * 金貨クラス。
 * @constructor
 * @extends {Card}
 */
var Gold = function() {
  Card.call(this, CardDb[Card.NAME.GOLD]);

  /**
   * プレイ時の処理を行う。
   * @param {!Player} player プレイヤー
   */
  this.play = function(player) {
    // 3コイン
    player.addCoin(3);
  }
}

/**
 * 銀貨クラス。
 * @constructor
 * @extends {Card}
 */
var Silver = function() {
  Card.call(this, CardDb[Card.NAME.SILVER]);

  /**
   * プレイ時の処理を行う。
   * @param {!Player} player プレイヤー
   */
  this.play = function(player) {
    player.addCoin(2);
  }
}

/**
 * 銅貨クラス。
 * @constructor
 * @extends {Card}
 */
var Copper = function() {
  Card.call(this, CardDb[Card.NAME.COPPER]);

  /**
   * プレイ時の処理を行う。
   * @param {!Player} player プレイヤー
   */
  this.play = function(player) {
    player.addCoin(1);
  }
}

/**
 * 属州クラス。
 * @constructor
 * @extends {Card}
 */
var Province = function() {
  Card.call(this, CardDb[Card.NAME.PROVINCE]);
}

/**
 * 公領クラス。
 * @constructor
 * @extends {Card}
 */
var Duchy = function() {
  Card.call(this, CardDb[Card.NAME.DUCHY]);
}

/**
 * 屋敷クラス。
 * @constructor
 * @extends {Card}
 */
var Estate = function() {
  Card.call(this, CardDb[Card.NAME.ESTATE]);
}

/**
 * 白金貨クラス。
 * @constructor
 * @extends {Card}
 */
var Platinum = function() {
  Card.call(this, CardDb[Card.NAME.PLATINUM]);

  /**
   * プレイ時の処理を行う。
   * @param {!Player} player プレイヤー
   */
  this.play = function(player) {
    player.addCoin(5);
  }
}

/**
 * 植民地クラス。
 * @constructor
 * @extends {Card}
 */
var Colony = function() {
  Card.call(this, CardDb[Card.NAME.COLONY]);
}

/**
 * 鍛冶屋クラス。
 * @constructor
 * @extends {Card}
 */
var Smithy = function() {
  Card.call(this, CardDb[Card.NAME.SMITHY]);

  /**
   * プレイ時の処理を行う。
   * @param {!Player} player プレイヤー
   */
  this.play = function(player) {
    // +3 カードを引く
    player.draw(3);
  }
}

/**
 * 学者クラス。
 * @constructor
 * @extends {Card}
 */
var Scholar = function() {
  Card.call(this, CardDb[Card.NAME.SCHOLAR]);

  /**
   * プレイ時の処理を行う。
   * @param {!Player} player プレイヤー
   */
  this.play = function(player) {
    // 手札を捨て札にする。
    player.discardAll();
    // +7 カードを引く
    player.draw(7);
  }
}

/**
 * 研究所クラス。
 * @constructor
 * @extends {Card}
 */
var Laboratory = function() {
  Card.call(this, CardDb[Card.NAME.LABORATORY]);

  /**
   * プレイ時の処理を行う。
   * @param {!Player} player プレイヤー
   */
  this.play = function(player) {
    // +2 カードを引く
    player.draw(2);
    // +1 アクション
    player.addAction(1);
  }
}

/**
 * 市場クラス。
 * @constructor
 * @extends {Card}
 */
var Market = function() {
  Card.call(this, CardDb[Card.NAME.MARKET]);

  /**
   * プレイ時の処理を行う。
   * @param {!Player} player プレイヤー
   */
  this.play = function(player) {
    // +1 カードを引く
    player.draw(1);
    // +1 アクション
    player.addAction(1);
    // +1 カードを購入
    player.addBuy(1);
    // +1 コイン
    player.addCoin(1);
  }
}

/**
 * 祝祭クラス。
 * @constructor
 * @extends {Card}
 */
var Festival = function() {
  Card.call(this, CardDb[Card.NAME.FESTIVAL]);

  /**
   * プレイ時の処理を行う。
   * @param {!Player} player プレイヤー
   */
  this.play = function(player) {
    // +2 アクション
    player.addAction(2);
    // +1 カードを購入
    player.addBuy(1);
    // +2 コイン
    player.addCoin(2);
  }
}

/**
 * サウナクラス。
 * @constructor
 * @extends {Card}
 */
var Sauna = function() {
  Card.call(this, CardDb[Card.NAME.SAUNA]);

  /**
   * プレイ時の処理を行う。
   * @param {!Player} player プレイヤー
   */
  this.play = function(player) {
    // +1 アクション
    player.addAction(1);
    // +1 カードを引く
    player.draw(1);

    // あなたは自分の手札からアヴァント１枚をプレイしてもよい。
    if(player.hand.has(Card.NAME.AVANTO) === true) {
      player.playAction(Card.NAME.AVANTO);
    }
  }
}

/**
 * アヴァントクラス。
 * @constructor
 * @extends {Card}
 */
var Avanto = function() {
  Card.call(this, CardDb[Card.NAME.AVANTO]);

  /**
   * プレイ時の処理を行う。
   * @param {!Player} player プレイヤー
   */
  this.play = function(player) {
    // +3 カードを引く
    player.draw(3);

    // あなたは自分の手札からサウナ１枚をプレイしてもよい。
    if(player.hand.has(Card.NAME.SAUNA) === true) {
      player.playAction(Card.NAME.SAUNA);
    }
  }
}

/**
 * 雇人クラス。
 * @constructor
 * @extends {Card}
 */
var Hireling = function() {
  Card.call(this, CardDb[Card.NAME.HIRELING]);

  /**
   * プレイ時の処理を行う。
   * @param {!Player} player プレイヤー
   */
  this.play = function(player) {
    var task = new Task(this, function(player, card, task) {
      player.draw(1);
    });
    player.addTurnStartTask(task);
    this.is_durational = true;
  }
}

/**
 * 海賊クラス。
 * @constructor
 * @extends {Card}
 */
var Pirate = function() {
  Card.call(this, CardDb[Card.NAME.PIRATE]);

  /**
   * プレイ時の処理を行う。
   * @param {!Player} player プレイヤー
   */
  this.play = function(player) {
    // 次ターン開始時に金貨を獲得する
    var self = this;
    var task = new Task(this, function(player, card, task) {
      player.tryGain(Card.NAME.GOLD, Player.GAIN_TO.HAND);
      self.is_durational = false;
      this.need_remove = true;
    });
    player.addTurnStartTask(task);
    this.is_durational = true;
  }
}