/**
 * @file サプライ山札生成に関する関数を定義する。
 */

/**
 * サプライ山札を生成するクラス関数を提供する。
 * @constructor
 */
var SupplyPileFactory = function() {
};

/**
 * サプライ山札を生成する。
 * @param {!string} cardName カード名 
 * @param {!number} num 山札枚数
 * @returns {SupplyPile} サプライ山札
 */
SupplyPileFactory.create = function(cardName, num) {
  var supplyPile = new SupplyPile(cardName);
  for(var i = 0; i < num; i++) {
    supplyPile.push(new CardDb[cardName].clazz());
  }
  return supplyPile;
}

/**
 * 通常のサプライ山札を生成する。
 * @param {!string} cardName カード名
 * @param {*} playerNum 未使用
 * @returns 
 */
SupplyPileFactory.createForNormalCard = function(cardName, playerNum) {
  return SupplyPileFactory.create(cardName, CardDb[cardName].supplyNum);
}

/**
 * 勝利点のサプライ山札を生成する。
 * プレイヤー数が2以下の場合、8枚で山札を作る。
 * @param {!string} cardName カード名
 * @param {*} playerNum プレイヤー数
 * @returns 
 */
SupplyPileFactory.createForVictoryCard = function(cardName, playerNum) {
  return SupplyPileFactory.create(cardName, playerNum <= 2 ? 8 : CardDb[cardName].supplyNum);
}