/**
 * @file ログ出力に関する情報を定義する。
 */

/**
 * ロガークラス。
 * @constructor
 */
var Logger = function() {

  /**
   * ログ出力する。(ログレベルが1より小さい場合は何もしない。)
   * @param {!*} オブジェクト
   */
  this.log1 = Setting.LOG_LEVEL >= 1
    ? function(obj) { WScript.Echo(obj); } : function(obj) {};

  /**
   * ログ出力する。(ログレベルが2より小さい場合は何もしない。)
   * @param {!*} オブジェクト
   */
  this.log2 = Setting.LOG_LEVEL >= 2
    ? function(obj) { WScript.Echo(obj); } : function(obj) {};
  /**
   * ログ出力する。(ログレベルが3より小さい場合は何もしない。)
   * @param {!*} オブジェクト
   */
  this.log3 = Setting.LOG_LEVEL >= 3
    ? function(obj) { WScript.Echo(obj); } : function(obj) {};

  /**
   * ログ出力する。(改行なし。)(ログレベルが1より小さい場合は何もしない。)
   * @param {!*} オブジェクト
   */
  this.write1 = Setting.LOG_LEVEL >= 1
    ? function(obj) { WScript.StdOut.Write(obj); } : function(obj) {};
}