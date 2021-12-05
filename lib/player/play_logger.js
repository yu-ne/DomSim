/**
 * @file プレイログに関する情報を定義する。
 */

/**
 * プレイログクラス。
 * @param {!string} playerName プレイヤー名
 * @constructor
 */
var PlayLogger = function(playerName) {
  /**
   * @type {!string} プレイヤー名
   */
  this.playerName = playerName;
  /**
   * @type {!number} 現在のターン数
   */
  this.turnNum = 0;
  /**
   * @type {!boolean} ログ出力が有効か
   */
  this.isEnabled = true;
  /**
   * @type {!Array<Array<string>>} ログ。ターン数 - 1をインデックスとしてアクセスする。
   */
  this.logs = [];

  /**
   * ターン数をインクリメントし、インクリメント後のターン数のログ出力領域を確保する。
   */
  this.turnCountUp = function() {
    this.turnNum++;
    this.logs.push([]);
  }

  /**
   * ログ出力を有効化する。
   */
  this.enable = function() {
    this.isEnabled = true;
  }

  /**
   * ログ出力を無効化する。
   */
  this.disable = function() {
    this.isEnabled = false;
  }

  /**
   * ログ出力する。ログ出力が無効化されている場合は何もしない。
   * @param {string} action 操作内容
   * @param {string} str 出力文字列
   */
  this.log = function(action, str) {
    if(this.isEnabled === false) {
      return;
    }

    msg = [this.playerName, action, str]
      .filter(function(item) { return item != null; }).join(", ");
    logger.log3(msg);
    if(this.turnNum > 0) {
      this.logs[this.turnNum - 1].push(msg);
    }
  }
}