/**
 * @file ボードに関する情報を定義する。
 */

/**
 * ボードクラス。
 * @constructor
 */
var Board = function() {

  /**
   * @type {!Player} プレイヤーの配列
   */
  this.players = [];
  /**
   * @type {!number} プレイヤー数
   */
  this.playerNum = 0;
  /**
   * @type {!Supply} サプライ
   */
  this.supply = new Supply();

  /**
   * サプライやプレイヤー情報などの初期化を行う。
   * @param {!Array<PlayerAi1>} ais AIの配列
   * @param {!Array<string>} kingdomCards 王国カードのカード名の配列
   * @param {!Array<string>} initialDeck 初期デッキのカード名の配列
   * @param {!boolean} shuffle_turn0_enabled 初期手札生成前にシャッフルするか
   */
  this.init = function(ais, kingdomCards, initialDeck, shuffle_turn0_enabled) {

    // プレイヤー情報を初期化
    this.players.pushArray(ais.map(function(ai, index) {
      return new Player("player" + (index + 1), new ai())
    }));
    this.playerNum = this.players.length;

    // サプライを生成
    this.supply.init(kingdomCards, this.playerNum);

    // プレイヤーに初期デッキを設定
    this.prepareGame(initialDeck, shuffle_turn0_enabled);
  }

  /**
   * プレイヤーに初期デッキを設定する。
   * @param {!Array<string>} initialDeck 初期デッキのカード名の配列
   * @param {!boolean} shuffle_turn0_enabled 初期手札生成前にシャッフルするか
   */
  this.prepareGame = function(initialDeck, shuffle_turn0_enabled) {

    // 初期デッキのカード名に対応するカードをサプライから取得し、プレイヤーのデッキに設定する
    var supply = this.supply;
    this.players.each(function(player){
      player.prepareGame(
        new Cards(initialDeck.map(function(cardName) {
          return supply.popSupplyCard(cardName);
        })),
        shuffle_turn0_enabled
      );
    });
  }
}