/**
 * @file デッキに関する情報を定義する。
 */

/**
 * デッキクラス。
 * @param {!Player} player プレイヤー
 * @constructor
 * @extends {Cards}
 */
var Deck = function() {
  Cards.call(this);

  /**
   * シャッフルする。
   */
  this.shuffle = function() {
    this.array.shuffle();
  }
}