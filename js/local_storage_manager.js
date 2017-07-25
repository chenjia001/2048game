window.fakeStorage = { /*fakeStorage就是作者自己写的一个localStorage的替代方法，也定义了setItem方法，getItem方法和removeItem方法。*/
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

function LocalStorageManager() {
  this.bestScoreKey     = "bestScore";
  this.gameStateKey     = "gameState";

  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;/*对supported进行判断，返回true使用window.localStorage，否则使用window.fakeStorage。*/
}

LocalStorageManager.prototype.localStorageSupported = function () { /*为了测试浏览器是否支持window.localStorage*/
  var testKey = "test";
  var storage = window.localStorage;

  try {  /*使用try..catch语句测试storage.setItem和storage.removeItem，来确保浏览器支持window.localStorage，执行成功返回true，否则执行catch里面的语句返回false。*/
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Best score getters/setters
LocalStorageManager.prototype.getBestScore = function () {
  return this.storage.getItem(this.bestScoreKey) || 0;
};

LocalStorageManager.prototype.setBestScore = function (score) {
  this.storage.setItem(this.bestScoreKey, score);
};

// Game state getters/setters and clearing
LocalStorageManager.prototype.getGameState = function () {
  var stateJSON = this.storage.getItem(this.gameStateKey);
  return stateJSON ? JSON.parse(stateJSON) : null; /*JSON.parse() 方法将JSON 字符串解析成为 JavaScript 中对应的基本数据类型。*/
};

LocalStorageManager.prototype.setGameState = function (gameState) {
  this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));  /*JSON.stringify() 方法将任意JavaScript 对应的基本数据类型序列化成 JSON 字符串*/
};

LocalStorageManager.prototype.clearGameState = function () {
  this.storage.removeItem(this.gameStateKey);
};
