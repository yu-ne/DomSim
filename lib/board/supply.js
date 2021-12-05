/**
 * @file サプライに関する情報を定義する。
 */

/**
 * サプライクラス。
 * @constructor
 */
var Supply = function() {
  this.piles = [];

  /**
   * サプライを初期化する。
   * @param {!Array<string>} kingdomCards 王国カードのカード名の配列
   * @param {!number} playerNum プレイヤー数
   */
  this.init = function(kingdomCards, playerNum) {

    // 王国カードのサプライの山札を生成
    var piles = this.piles;
    kingdomCards.each(function(cardName){
      piles.push(CardDb[cardName].createSupllyPile(playerNum));
    });

    // 基本カードのサプライの山札を生成
    this.piles.push(CardDb[Card.NAME.GOLD].createSupllyPile(playerNum));
    this.piles.push(CardDb[Card.NAME.SILVER].createSupllyPile(playerNum));
    this.piles.push(CardDb[Card.NAME.COPPER].createSupllyPile(playerNum));
    this.piles.push(CardDb[Card.NAME.PROVINCE].createSupllyPile(playerNum));
    this.piles.push(CardDb[Card.NAME.DUCHY].createSupllyPile(playerNum));
    this.piles.push(CardDb[Card.NAME.ESTATE].createSupllyPile(playerNum));
    this.piles.push(CardDb[Card.NAME.PLATINUM].createSupllyPile(playerNum));
    this.piles.push(CardDb[Card.NAME.COLONY].createSupllyPile(playerNum));
  }

  /**
   * 指定カード名のサプライの山札を取得する。
   * @param {!string} cardName カード名
   * @returns {SupplyPile} サプライの山札(取得できなかった場合はnull)
   */
  this.getPile = function(cardName) {
    var tmp = this.piles.filter(function(pile) {
      return pile.name === cardName ? true : false;
    });
    return tmp.isEmpty() ? null : tmp[0];
  }

  /**
   * 指定カード名のサプライの山札が空かどうか判定する。
   * @param {!string} cardName カード名
   * @returns {!boolean} 空かどうか
   */
  this.isEmpty = function(cardName) {
    var pile = this.getPile(cardName);
    return pile === null || pile.isEmpty() ? true : false;
  }

  /**
   * 指定カード名のサプライの山札からカードを取得する。(サプライの山札から取り除かない)
   * @param {!string} cardName カード名
   * @returns {Card} カード(取得できなかった場合はnull)
   */
  this.getTopSupplyCard = function(cardName) {
    var pile = this.getPile(cardName);
    return pile === null ? null : pile.getTop();
  }

  /**
   * 指定カード名のサプライの山札からカードを取得する。(サプライの山札から取り除く)
   * @param {!string} cardName カード名
   * @returns {Card} カード(取得できなかった場合はnull)
   */
  this.popSupplyCard = function(cardName) {
    var pile = this.getPile(cardName);
    return pile === null  ? null : pile.pop();
  }
}
