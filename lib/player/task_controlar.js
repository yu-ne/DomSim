/**
 * @file タスクコントローラに関する情報を定義する。
 *       持続カードの持続効果を適用するための仕組みを提供する。
 */

/**
 * タスククラス。
 * @param {Card} card カード
 * @param {!function(Player, Card, Task)} func 処理
 * @constructor
 */
var Task = function(card, func) {
  this.card = card;
  this.func = func;
  this.need_remove = false;

  /**
   * 設定された処理を実行する。
   * @param {!Player} player プレイヤー
   */
  this.execute = function(player) {
    this.func(player, card, this);
  }
}

/**
 * タスクコントローラクラス。
 * 設定されたタスクの実行と削除を行う。
 * @constructor
 */
var TaskControlar = function() {
  /**
   * タスクの配列。
   * @type {!Array<Task>}
   */
  this.tasks = [];

  /**
   * タスクを追加する。
   * @param {!Task} task タスク
   */
  this.addTask = function(task) {
    this.tasks.push(task);
  }

  /**
   * 設定されたタスクをすべて実行する。
   * 削除が必要なタスクは実行後に削除する。
   * @param {!Player} player プレイヤー
   */
  this.executeTasks = function(player) {
    for(var i = 0; i < this.tasks.length; ) {
      this.tasks[i].execute(player);
      if(this.tasks[i].need_remove === true) {
        // 削除した場合はインデックスをインクリメントしない
        this.splice(i, 1);
      }
      else {
        i++;
      }
    }
  }
}