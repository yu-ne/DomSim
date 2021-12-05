/**
 * @file カードの束に関する情報を定義する。
 */

/**
 * カードの束クラス。
 * Card型の要素を持つ配列のラッパクラス。
 * @param {Array<*>} array 配列(省略可)
 */
var Cards = function(array) {
  this.array = array == undefined ? [] : array;

  /**
   * カードが空かどうか判定する。
   * @returns {boolean} 空の場合true、そうでない場合false
   */
  this.isEmpty = function() {
    return this.array.isEmpty();
  }

  /**
   * カードの枚数を取得する。
   * @returns {number} カードの枚数
   */
  this.count = function() {
    return this.array.length;
  }

  /**
   * 指定カード名のカードの枚数を取得する。
   * @param {!string} cardName カード名
   * @returns {boolean} カードの枚数
   */
  this.countByCardName = function(cardName) {
    return this.array.countIf(function(card) { return card.is(cardName); });
  }

  /**
   * 指定カード名のカードが存在するか判定する。
   * @param {!string} cardName カード名
   * @returns {boolean} 指定カード名のカードが存在する場合true、そうでない場合false
   */
  this.has = function(cardName) {
    return this.countByCardName(cardName) <= 0 ? false : true;
  }

  /**
   * 指定カード名のカードを1枚取り除く。
   * @param {!string} cardName カード名
   * @returns {Card} 取り除いたカード(存在しなかった場合はnull)
   */
  this.popByName = function(cardName) {
    var index = this.array.findIndex(function(card) { return card.is(cardName)});
    return index === -1 ? null : this.array.splice(index, 1)[0];
  }

  /**
   * カードを1枚取り除く。
   * @returns {Card} 取り除いたカード(空の場合はnull)
   */
  this.pop = function() {
    var cards = this.popMulti(1);
    return cards.isEmpty() ? null : cards.array[0];
  }

  /**
   * カードをすべて取り除く。
   * @returns {Cards} 取り除いたカードの束
   */
  this.popAll = function() {
    return this.popMulti(this.count());
  }

  /**
   * 指定枚数カードを取り除く
   * @param {!number} num 取り除く枚数
   * @returns {Cards} 取り除いたカードの束
   */
  this.popMulti = function(num) {
    var ret = new Cards();
    var cardNum = this.count();
    for(var i = 0; i < Math.min(cardNum, num); i++) {
      ret.push(this.array.pop());
    }
    return ret;
  }

  /**
   * コールバックがtrueを返す、カードをすべて取り除く。
   * @param {!function(Card):boolean} func コールバック
   * @returns {Cards} 取り除いたカードの束
   */
  this.popAllByFunc = function(func) {
    return new Cards(this.array.pickUp(func));
  }

  /**
   * カードを追加する。
   * @param {!Card} card カード
   */
  this.push = function(card) {
    this.array.push(card);
  }

  /**
   * カードの配列を追加する。
   * @param {!Array<Card>} array Card型の要素を持つ配列
   */
  this.pushCardArray = function(array) {
    this.array.pushArray(array);
  }

  /**
   * カードの束を追加する。
   * @param {!Cards} cards カードの束
   */
  this.pushCards = function(cards) {
    this.array.pushArray(cards.array);
  }

  /**
   * 保持しているカードのカード名の配列を取得する。
   * @returns {Array<string>} カード名の配列
   */
  this.getCardNames = function() {
    return this.array.map(function(card) { return card.name; });
  }

  /**
   * 保持しているカードのカード名をログ出力する。
   * @param {!string} msg メッセージ
   * @param {!function(*)} func ログ出力関数
   */
  this.logCards = function(msg, func) {
    func(msg + ":" + this.getCardNames().join(", "));
  }

  /**
   * 保持しているカードの順序を逆順にする。
   */
  this.reverse = function() {
    this.array.reverse();
  }
}
