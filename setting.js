/**
 * @file ドミニオンシミュレータの設定を定義する。
 */

/**
 * プレイヤーAIクラス。
 * アクションフェーズや購入フェーズのプレイヤーの動作を定義する。
 * @constructor
 */
var PlayerAi1 = function() {

  /**
   * アクションフェーズでの処理を設定する。
   *
   * 本メソッドがコールされたときのアクションカードのプレイは1枚のみとすること。
   * 1ターンの間でも、手札にアクションカードがありアクション権が存在する間、本メソッドがコールされ続けるため、
   * 1ターン内に複数枚アクションカードをプレイしたい場合は、この仕組みを利用すること。
   *
   * アクションカードをプレイした場合は戻り値としてtrueを返却してください。
   * プレイしなかった場合はfalseを返却してください。
   *
   * @param {!Player} player プレイヤー
   * @returns アクションをプレイした場合true、そうでない場合false
   */
  this.processActionPhase = function(player) {

    // 鍛冶屋のプレイを試みる。(手札に鍛冶屋があればプレイされる)
    if(player.tryPlayCard(Card.NAME.SMITHY) === true) {
      return true;
    }

    return false;
  }

  /**
   * 購入フェーズでの処理を設定する。
   *
   * 本メソッドがコールされたときの購入カードは1枚のみとすること。
   * 1ターンの間でも、購入権が存在する間、本メソッドがコールされ続けるため、
   * 1ターン内に複数枚カードを購入したい場合は、この仕組みを利用すること。
   *
   * カードを購入した場合は戻り値としてtrueを返却してください。
   * 購入しなかった場合はfalseを返却してください。
   *
   * @param {!Player} player プレイヤー
   * @returns カードを購入した場合true、そうでない場合false
   */
  this.processBuyPhase = function(player) {

    // 財宝カードをすべてプレイ
    player.playAllTreasure();

    // ① 8金以上、かつデッキ内の金貨が1枚以上の場合、属州を購入
    if(player.coinNum >= 8 && player.countByCardNameInDeck(Card.NAME.GOLD) >= 1) {
      // 属州が購入を試みる。(サプライに存在しなかったなどの理由で購入できなかった場合は、②移行のロジックに移る)
      if(player.tryBuy(Card.NAME.PROVINCE) === true) {
        return true;
      }
    }

    // ② 6金以上の場合、金貨を購入
    if(player.coinNum >= 6) {
      if(player.tryBuy(Card.NAME.GOLD) === true) {
        return true;
      }
    }

    // ③ 4金以上かつ、デッキの鍛冶屋が1枚未満の場合は鍛冶屋を購入
    if(player.coinNum >= 4 && player.countByCardNameInDeck(Card.NAME.SMITHY) < 1) {
      if(player.tryBuy(Card.NAME.SMITHY) === true) {
        return true;
      }
    }

    // ④ 3金以上の場合、銀貨を購入
    if(player.coinNum >= 3) {
      if(player.tryBuy(Card.NAME.SILVER) === true) {
        return true;
      }
    }

    // 何も購入しない
    return false;
  }
}

/**
 * 設定クラス。
 * シミュレート条件を設定する。
 * @constructor
 */
var Setting = function() {
}

/**
 * 使用するプレイヤーAIを設定する。
 * 当該項目の設定数がそのままプレイヤー人数となる。
 * 複数のプレイヤーを設定する場合は、[PlayerAi1, PlayerAi2]のようにカンマ区切りで設定すること。
 * 同じプレイヤーAIを複数設定することも可能。
 * @type {!Array<*>} プレイヤーAIの配列。
 */
Setting.PLAYER_AIS = [PlayerAi1];

/**
 * 王国カードを設定する。
 * Card.NAMEに存在するカード名を指定可能。
 * 複数の王国カードを設定する場合は、カンマ区切りで設定すること。
 * 最大10種類ではなく、何種類でも設定可能。
 * @type {!string} カード名の配列
 */
Setting.KINGDOM_CARDS = [
  Card.NAME.SMITHY,
  Card.NAME.LABORATORY,
  Card.NAME.FESTIVAL,
  Card.NAME.MARKET,
  Card.NAME.LABORATORY,
  Card.NAME.SCHOLAR,
  Card.NAME.HIRELING
];

/**
 * 初期デッキを定義する。
 * Card.NAMEに存在するカード名を指定可能。
 * 銅貨や屋敷などの基本カードおよび王国カードに設定したカードを設定可能。
 *
 * 引き切り検証などを行いたい場合は、当該項目に任意のデッキ内容を設定し、
 * ゲーム終了条件を1ターン終了にすると良い。
 * @type {!string} カード名の配列
 */
Setting.INITIAL_DECK = [
  Card.NAME.COPPER,
  Card.NAME.COPPER,
  Card.NAME.COPPER,
  Card.NAME.COPPER,
  Card.NAME.COPPER,
  Card.NAME.COPPER,
  Card.NAME.COPPER,
  Card.NAME.ESTATE,
  Card.NAME.ESTATE,
  Card.NAME.ESTATE
];

/**
 * ターン1の手札生成時にシャッフルするかを設定する。
 * falseを設定した場合、1巡目は初期デッキの設定順ドローした上でシミュレートが実行される。
 * ※2巡目以降は通常通りシャッフルが入る。
 * 主に初手金量を2-5で固定したい場合などの用途でfalseが設定されることを想定している。
 * @type {!boolean} ターン1開始前にデッキをシャッフルするか
 */
Setting.SHUFFLE_TURN0_ENABLED = true;

/**
 * @type {!number} ゲームの試行回数(最大5000くらいが無難)
 */
Setting.SIMULATE_NUM = 5000;

/**
 * 1ゲームの最大ターン数を設定する。
 * ゲーム終了条件を満たしていない場合でも当該ターン数ゲームが続いた場合、
 * ゲームが終了する。ゲーム終了条件を満たさないことによる無限ループ回避のための設定。
 * 基本変更することはないはず。
 * @type {!number} 1ゲームの最大ターン数
 */
Setting.MAX_TRUN_NUM = 30;

/**
 * ログレベルを設定する。
 * 基本的には1の設定を推奨する。
 * 1:シミュレート条件、およびシミュレート結果を表示する。
 * 2:上記に加え、1ゲーム毎にゲーム終了時のプレイヤーのデッキ内容を表示する。
 * 3:上記に加え、プレイヤーのプレイログを表示する。(ドミニオンオンラインの操作ログに近い)
 * @type {!number} ログレベル(1～3)
 */
Setting.LOG_LEVEL = 1;

/**
 * ゲーム終了条件を設定する。
 * 各プレイヤーのターン終了時にコールされる。
 * ゲーム終了条件を満たしている場合はtrueを返却すること。
 * @returns {boolean} ゲーム終了条件を満たしている場合true、そうでない場合false
 */
Setting.isGameEnd = function() {

  // プレイヤー1のデッキ内の属州枚数が4枚になったらゲーム終了
  if((board.players[0].countByCardNameInDeck(Card.NAME.PROVINCE) >= 4)
    ||
    (board.players[0].countByCardNameInDeck(Card.NAME.PROVINCE) >= 3
      && board.players[0].countByCardNameInDeck(Card.NAME.DUCHY) >= 2)) {
    return true;
  }

  return false;
}

/**
 * Setting.SIMULATE_NUMの数だけゲームを試行後に1度だけコールされる。
 * シミュレーション結果を表示する。
 * logger.log1(string)関数を用いてログ出力することを推奨する。
 * @param {!SimulationResult} simResult シミュレーション結果
 */
Setting.logSimulateResult = function(simResult) {

  // key:プレイヤー名、val:各ゲームのターン数を格納した連想配列
  var turnNumHash = simResult.getTurnNumHash();
  // プレイヤー毎に平均ターン数を出力
  logger.log1("Trun Average");
  for(key in turnNumHash) {
    logger.log1(key + ":" + turnNumHash[key].average());
  }
}