/**
 * @file 配列の拡張メソッドを定義する。
 */

/**
 * 空かどうか判定する。
 * @returns {boolean} 空の場合true、そうでない場合false。
 */
Array.prototype.isEmpty = function(){
  return this.length === 0 ? true : false;
}

/**
 * 指定されたコールバック関数を配列の各要素に対して1度ずつ実行する。
 * @param {!function(!*, !number)} func コールバック
 *   第1引数:現在処理されている要素
 *   第2引数:現在処理されている要素の添え字
 * @returns {Array} 自身の配列
 */
Array.prototype.each = function(func){
  for(var i = 0; i < this.length; i++){
    func.call(this, this[i], i);
  }
  return this;
};

/**
 * 配列のそれぞれの要素に対して指定したコールバック関数を呼び出す。
 * その際、直前の要素における計算結果の返値を渡す。
 * 配列のすべての要素に対してコールバック関数を実行した結果が単一の値が最終結果になります。
 * @param {!function(!*, !*, !number):*} func コールバック
 *   第1引数:前回のコールバックの戻り値
 *   第2引数:現在処理されている要素
 *   第3引数:現在処理されている要素の添え字
 * @param {!*} initVal コールバック関数初めて呼び出されたときの第1引数の初期値
 * @returns {*} 全要素にコールバック関数を呼び出した結果
 */
Array.prototype.reduce = function(func, initVal){
  var result = initVal;
  this.each(function(item, index){
    result = func(result, item, index);
  });
  return result;
};

/**
 * コールバックを配列のすべての要素に対して呼び出し、その結果からなる新しい配列を生成する。
 * @param {!function(!*):*} func コールバック
 * @returns 新しい配列
 */
Array.prototype.map = function(func) {
  return this.reduce(function(result, item, index){
    result.push(func.apply(result, [item, index]));
    return result;
  }, []);
};

/**
 * コールバックがtrueを返す、配列中の要素を格納した新しい配列を生成する。
 * @param {!function(!*):boolean} func コールバック
 * @returnsa 新しい配列
 */
Array.prototype.filter = function(func) {
  return this.reduce(
    function(result, item){
      if(func(item)){
        result.push(item);
      }
      return result;
    },
    []
  );
};

/**
 * コールバックを配列中の少なくとも1個の要素が満たした場合にtrueを返却する。
 * @param {!function(!*):boolean} func コールバック
 * @returns {boolean} コールバックを満たす要素を含んでいる場合true、そうでない場合false
 */
Array.prototype.some = function(func) {
  return this.filter(func).length === 0 ? false : true;
};

/**
 * 指定要素を配列中に含んでいるか判定する。
 * @param {!*} item 要素
 * @returns {boolean} 指定要素を含んでいる場合true、そうでない場合false
 */
Array.prototype.includes = function(item) {
  return this.some(function(e) { return e === item});
};

/**
 * コールバックがtrueを返す、配列中の要素数を取得する。
 * @param {!function(!*):boolean} func コールバック
 * @returns
 */
Array.prototype.countIf = function(func) {
  return this.filter(func).length;
};

/**
 *
 * コールバックがtrueを返す、配列中の要素を取得し、配列から取り除く。
 * 内部でsort関数を用いているため、配列の順序が変わる可能性あり。
 * 実装内容の改善の検討が必要。
 * @param {!function(!*):boolean} func コールバック
 * @returns
 */
Array.prototype.pickUp = function(func) {
  this.sort(function(a, b) {
    if(func(a)) {
      return -1;
    }
    else if(func(b)) {
      return 1;
    }
    else {
      return 0;
    }
  });

  return this.splice(0, this.countIf(func));
}

/**
 * 配列内の指定されたコールバック関数を満たす最初の要素の位置を返す。
 * コールバック関数を満たす要素がない場合、-1を返す。
 * @param {!function(!*):boolean} func コールバック
 *   第1引数:配列の要素
 * @returns {number} 最初にコールバック関数を満たした要素のインデックス
 */
Array.prototype.findIndex = function(func) {
  var ret = -1;
  for(var i = 0; i < this.length; i++){
    if(func(this[i])) {
      ret = i;
      return ret;
    };
  }
  return ret;
};

/**
 * 指定された配列をマージする。
 * @param {!Array<*>} array 配列
 */
Array.prototype.pushArray = function(array) {
  Array.prototype.push.apply(this, array);
};

/**
 * 配列の要素をランダムに入れ替える。
 */
Array.prototype.shuffle = function() {
  for(var i = this.length - 1; i > 0; i--){
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = this[i];
    this[i] = this[j];
    this[j] = tmp;
  }
}

/**
 * 配列内の数値の平均値を算出する。
 * 配列内の全要素が数値の場合のみ呼び出すこと。
 * 配列が空の場合、0を返却する。
 * @returns {number} 平均値
 */
Array.prototype.average = function() {
  return this.length === 0 ? 0
    : this.reduce(function(result, item) { return result + item }, 0) / this.length;
}

/**
 * 配列内の要素の個数を数え、結果を連想配列で取得する。
 * @returns {Object} key:要素、val:個数の連想配列
 */
Array.prototype.countItemNum = function() {
  return this.reduce(function(hash, cardName) {
    if(cardName in hash) {
      hash[cardName]++;
    }
    else {
      hash[cardName] = 1;
    }
    return hash;
  }, {});
}