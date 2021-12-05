/**
 * @type {!Board} ボード。すべての情報はここに保持される。
 */
var board = null;
/**
 * @type {!Logger} ロガー。
 */
var logger = null;

/**
 * シミュレータクラス。
 * @constructor
 */
var Simulator = function() {

  /**
   * メイン関数。
   */
  this.main = function() {

    // ロガーの生成
    logger = new Logger();

    // シミュレート開始のログ出力
    this.logSimulateStart();

    // 指定回数シミュレートを実行し、結果を保持する
    var simResult = new SimulationResult();
    for(var i = 0; i < Setting.SIMULATE_NUM; i++) {
      var gameResult = this.simulate(i + 1);
      simResult.addGameResult(gameResult);
    }

    // シミュレート結果をログ出力
    this.logSimulateEnd(simResult);

    logger.log1("Press The Enter Key...");
    WScript.StdIn.Readline();
  }

  /**
   * 1ゲームシミュレートする。
   * @param {!number} gameId ゲームID
   * @returns {GameResult} ゲーム結果
   */
  this.simulate = function(gameId) {

    // ゲーム開始のログを出力
    this.logGameStart(gameId);

    // サプライや初期手札の設定を行う
    board = new Board();
    board.init(Setting.PLAYER_AIS, Setting.KINGDOM_CARDS,
      Setting.INITIAL_DECK, Setting.SHUFFLE_TURN0_ENABLED);

    // ゲームスタート
    this.startGame();

    // ゲーム終了のログ出力
    this.logGameEnd();

    return new GameResult(gameId, board);

  }

  /**
   * ゲームを開始する。
   */
  this.startGame = function() {
    // 設定された最大ターン数だけターンをまわす。
    for(var i = 0; i < Setting.MAX_TRUN_NUM; i++) {
      for(var j = 0; j < board.playerNum; j++) {
        board.players[j].processTurn();
        // 設定されたゲーム終了条件を満たしたら終了
        if(Setting.isGameEnd() === true) {
          return;
        }
      }
    }
  }

  /**
   * ゲーム開始のログ出力を行う。
   * @param {!number} gameId ゲームID
   */
  this.logGameStart = function(gameId) {
    if(Setting.LOG_LEVEL <= 1) {
      // ログレベルが1の場合、シミュレートの進捗を表示する。
      logger.write1("\rSimulate Num:" + gameId);
    }

    logger.log2("----------------");
    logger.log2("Game Start(Game Id:" + gameId + ")\n");
  }

  /**
   * ゲーム終了のログ出力を行う。
   */
  this.logGameEnd = function() {
    logger.log2("");
    logger.log2("Game End");
    // 各プレイヤーのデッキ内容を出力
    logger.log2("deck");
    board.players.each(function(player) {
      player.logDeck();
    });
  }

  /**
   * シミュレート開始のログ出力を行う。
   */
  this.logSimulateStart = function() {
    this.logBoederDoubleLine();
    // シミュレート条件
    this.logSimulateMsgWithStr("Condition");
    // 初期デッキ
    logger.log1("Initial Deck:" + Setting.INITIAL_DECK.join(", "));
    // 試行回数
    logger.log1("Simulate Num:" + Setting.SIMULATE_NUM);
    this.logBoederDoubleLine();
    this.logSimulateMsgWithStr("Start");
  }

  /**
   * シミュレート結果をログ出力する。
   * @param {!SimulationResult} simResult シミュレーション結果
   */
  this.logSimulateEnd = function(simResult) {
    if(Setting.LOG_LEVEL <= 1) {
      // ログレベルが1の場合、表示していたシミュレートの進捗を削除する。
      // カーソルを先頭に戻すことで、この次の二重線の表示で上書きされる。
      logger.write1("\r");
    }
    this.logBoederDoubleLine();
    this.logSimulateMsgWithStr("Result");

    // 設定されたシミュレート結果出力処理を呼び出す
    Setting.logSimulateResult(simResult);

    this.logBoederDoubleLine();
    this.logSimulateMsgWithStr("End");
  }

  /**
   * シミュレートに関するログ出力を行う。
   * @param {!string} str メッセージ
   */
  this.logSimulateMsgWithStr = function(str) {
    logger.log1("- Simulate " + str + " -\n");
  }

  /**
   * 二重線をログ出力する。
   */
  this.logBoederDoubleLine = function() {
    logger.log1("=======================");
  }
}