/**
 * カード情報を持つレコード。
 * @param {!Card} clazz カードクラス。
 * @param {!string} name カード名
 * @param {!Array<Card.TYPE>} types カードタイプの配列
 * @param {!Cost} cost コスト
 * @param {!number} victoryPoint 勝利点
 * @param {!number} supplyNum サプライ配置時の枚数
 * @param {!function(!number):SupllyPile} createSupplyPileFunc サプライの山を生成する関数
 * @constructor
 */
var CardDbRecord = function(clazz, name, types, cost, victoryPoint, supplyNum, createSupplyPileFunc) {
  /**
   * @type {!Card} カードクラス。
   */
  this.clazz = clazz;

  /**
   * @type {!string} カード名。
   */
  this.name = name;

  /**
   * @type {!Array<Card.TYPE>} カードタイプの配列。
   */
  this.types = types;

  /**
   * @type {!Cost} コスト。
   */
  this.cost = cost;

  /**
   * @type {!number} 勝利点。(勝利点カード以外は基本0)
   */
  this.victoryPoint = victoryPoint;

  /**
   * @type {!number} サプライ配置時の山札の枚数。
   */
  this.supplyNum = supplyNum;

  /**
   * @type {!function(!number):SupllyPile} サプライの山を生成する関数。
   */
  this.createSupplyPileFunc = createSupplyPileFunc;

  /**
   * サプライの山札を生成する。
   * @param {!number} playerNum プレイヤー数
   * @returns {SupllyPile} サプライの山札。
   */
  this.createSupllyPile = function(playerNum) {
    return this.createSupplyPileFunc(this.name, playerNum);
  }
}

/**
 * @type {!object} key:カード名(string)、val:CardDbRecordを持つ連想配列。
 */
var CardDb = {};
CardDb[Card.NAME.GOLD] = new CardDbRecord(Gold, Card.NAME.GOLD, [Card.TYPE.TREASURE], new Cost(6, 0, 0), 0,
  30, SupplyPileFactory.createForNormalCard);
CardDb[Card.NAME.SILVER] = new CardDbRecord(Silver, Card.NAME.SILVER, [Card.TYPE.TREASURE], new Cost(3, 0, 0), 0,
  40, SupplyPileFactory.createForNormalCard);
CardDb[Card.NAME.COPPER] = new CardDbRecord(Copper, Card.NAME.COPPER, [Card.TYPE.TREASURE], new Cost(0, 0, 0), 0,
  60, SupplyPileFactory.createForNormalCard);
CardDb[Card.NAME.PROVINCE] = new CardDbRecord(Province, Card.NAME.PROVINCE, [Card.TYPE.VICTORY], new Cost(8, 0, 0), 6,
  12, SupplyPileFactory.createForVictoryCard);
CardDb[Card.NAME.DUCHY] = new CardDbRecord(Duchy, Card.NAME.DUCHY, [Card.TYPE.VICTORY], new Cost(5, 0, 0), 3,
  12, SupplyPileFactory.createForVictoryCard);
CardDb[Card.NAME.ESTATE] = new CardDbRecord(Estate, Card.NAME.ESTATE, [Card.TYPE.VICTORY], new Cost(2, 0, 0), 1,
  12, SupplyPileFactory.createForNormalCard);
CardDb[Card.NAME.PLATINUM] = new CardDbRecord(Gold, Card.NAME.PLATINUM, [Card.TYPE.TREASURE], new Cost(9, 0, 0), 0,
  12, SupplyPileFactory.createForNormalCard);
CardDb[Card.NAME.COLONY] = new CardDbRecord(Colony, Card.NAME.COLONY, [Card.TYPE.VICTORY], new Cost(11, 0, 0), 10,
  12, SupplyPileFactory.createForVictoryCard);
CardDb[Card.NAME.SMITHY] = new CardDbRecord(Smithy, Card.NAME.SMITHY, [Card.TYPE.ACTION], new Cost(4, 0, 0), 0,
  10, SupplyPileFactory.createForNormalCard);
CardDb[Card.NAME.SCHOLAR] = new CardDbRecord(Scholar, Card.NAME.SCHOLAR, [Card.TYPE.ACTION], new Cost(5, 0, 0), 0,
  10, SupplyPileFactory.createForNormalCard);
CardDb[Card.NAME.LABORATORY] = new CardDbRecord(Laboratory, Card.NAME.LABORATORY, [Card.TYPE.ACTION], new Cost(5, 0, 0), 0,
  10, SupplyPileFactory.createForNormalCard);
CardDb[Card.NAME.MARKET] = new CardDbRecord(Market, Card.NAME.MARKET, [Card.TYPE.ACTION], new Cost(5, 0, 0), 0,
  10, SupplyPileFactory.createForNormalCard);
CardDb[Card.NAME.FESTIVAL] = new CardDbRecord(Festival, Card.NAME.FESTIVAL, [Card.TYPE.ACTION], new Cost(5, 0, 0), 0,
  10, SupplyPileFactory.createForNormalCard);
CardDb[Card.NAME.SAUNA] = new CardDbRecord(Sauna, Card.NAME.SAUNA, [Card.TYPE.ACTION], new Cost(4, 0, 0), 0,
  5, SupplyPileFactory.createForNormalCard);
CardDb[Card.NAME.AVANTO] = new CardDbRecord(Avanto, Card.NAME.AVANTO, [Card.TYPE.ACTION], new Cost(5, 0, 0), 0,
  5, SupplyPileFactory.createForNormalCard);
CardDb[Card.NAME.HIRELING] = new CardDbRecord(Hireling, Card.NAME.HIRELING, [Card.TYPE.ACTION, Card.TYPE.DURATION], new Cost(6, 0, 0), 0,
  10, SupplyPileFactory.createForNormalCard);
