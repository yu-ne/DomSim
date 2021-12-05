/**
 * @file 手札に関する情報を定義する。
 */

/**
 * 手札クラス。
 * @constructor
 * @extends {Cards}
 */
var Hand = function() {
  Cards.call(this);

  /**
   * 指定したカードの種類を持つカードをすべて取得し、取り除く。
   * @param {!Card.TYPE} cardType カードの種類
   * @returns {Cards} カードの束
   */
  this.popAllByCardType = function(cardType) {
    return this.popAllByFunc(function(card) { return card.types.includes(cardType); });
  }

  /**
   * 指定したカードの種類を持つカードの枚数を取得する。
   * @param {!Card.TYPE} cardType カードの種類
   */
  this.countByCardType = function(cardType) {
    this.getCardsByCardType(cardType).count();
  }

  /**
   * 指定したカードの種類を持つカードをすべて取得する。(取り除きはしない)
   * @param {!Card.TYPE} cardType カードの種類
   * @returns {Cards} カードの束
   */
  this.getCardsByCardType = function(cardType) {
    return new Cards(
      this.array.filter(function(card) { return card.types.includes(cardType); }));
  }
}