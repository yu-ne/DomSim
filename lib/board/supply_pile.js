/**
 * @file サプライの山札に関する情報を定義する。
 */

/**
 * サプライの山札クラス。
 * @param {!string} name カード名
 * @constructor
 * @extends {Cards}
 */
var SupplyPile = function(name) {
  Cards.call(this);

  /**
   * @type {!string} カード名
   */
  this.name = name;

  /**
   * デッキトップのカードを取得する。(取り除きはしない)
   * @returns {Card} カード(存在しない場合はnull)
   */
  this.getTop = function() {
    return this.isEmpty() ? null : this.array.slice(-1)[0];
  }

}
