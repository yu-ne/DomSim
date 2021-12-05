/**
 * @file シミュレーション結果に関する情報を定義する。
 */

/**
 * ゲーム結果クラス。
 * @param {!number} gameId ゲームID
 * @param {!Board} board ボード
 * @constructor
 */
var GameResult = function(gameId, board) {
  this.gameId = gameId;
  this.board = board;
}

/**
 * シミュレーション結果クラス。
 * @constructor
 */
var SimulationResult = function() {
  this.gameResults = [];

  /**
   * ゲーム結果を追加する。
   * @param {!GameResult} gameResult ゲーム結果
   */
  this.addGameResult = function(gameResult) {
    this.gameResults.push(gameResult);
  }

  /**
   * 各ゲームでのターン数をプレイヤー毎に格納した連想配列を取得する。
   * @returns {Object} key:プレイヤー名、val:各ゲームでのターン数の配列<number>
   */
  this.getTurnNumHash = function() {
    return this.gameResults.reduce(function(hash, result) {
      result.board.players.each(function(player) {
        if(player.name in hash) {
          hash[player.name].push(player.turnNum);
        }
        else {
          hash[player.name] = [player.turnNum];
        }
      });
      return hash;
    }, {});
  }
}