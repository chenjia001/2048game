function KeyboardInputManager() { /*这是为了统一不同的浏览器中对触摸事件的处理，运用的if判断语句统一命名，为后面的编程做准备。*/
  this.events = {}; /*定义了一个events对象*/
/*
  if (window.navigator.msPointerEnabled) { //window.navigator 对象包含有关访问者浏览器的信息
    //Internet Explorer 10 style
    this.eventTouchstart    = "MSPointerDown"; //移动设备上不支持鼠标事件，好在webkit内核的移动浏览器支持 touch 事件
    this.eventTouchmove     = "MSPointerMove"; //所以触摸事件是移动应用中所必须的。touchstart、touchmove、touchend事件可以类比于mousedown、mouseover、mouseup的触发
    this.eventTouchend      = "MSPointerUp";
  } else {
    this.eventTouchstart    = "touchstart";
    this.eventTouchmove     = "touchmove";
    this.eventTouchend      = "touchend";
  }
*/
  this.listen();
}
/*在自定义函数KeyboardInputManager的原型<prototype>上定义方法*/
KeyboardInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {  /*对数组中的每一项运行给定函数，这个方法没有返回值*/
      callback(data);
    });
  }
};

KeyboardInputManager.prototype.listen = function () {
  var self = this;  /*为了在内部函数能使用外部函数的this对象，要给它赋值了一个名叫self的变量*/

  var map = {  // 用对象字面量方式创建map对象
    38: 0, // Up    //js event.keyCode对应的键码
    39: 1, // Right  //有趣的是这里不仅给光标移动映射了上下左右的移动事件，还对常用的游戏按键W A S D,还有Vim中的H J K L映射了上下左右的移动事件
    40: 2, // Down
    37: 3, // Left
    75: 0, // Vim up
    76: 1, // Vim right
    74: 2, // Vim down
    72: 3, // Vim left
    87: 0, // W
    68: 1, // D
    83: 2, // S
    65: 3  // A
  };

  // Respond to direction keys
  document.addEventListener("keydown", function (event) {  //对全局进行事件监听，把握键盘方向键的控制,addEventListener方法向指定元素添加事件
    var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
                    event.shiftKey;    //element.addEventListener(event, function, useCapture)event必须。字符串，指定事件名;function必须。指定要事件触发时执行的函数。最后一个可选
    var mapped    = map[event.which];  //E下js可以使用event.keyCode.但是在FF(firefox)下则不行。只能使用event.which.

    if (!modifiers) {  //判断按键是否标准，执行移动的函数
      if (mapped !== undefined) {
        event.preventDefault();   //该方法将通知 Web 浏览器不要执行与事件关联的默认动作（如果存在这样的动作）
        self.emit("move", mapped);   //调用上面定义的emit方法
      }
    }

    // R key restarts the game   添加R快捷键的行为
    if (!modifiers && event.which === 82) {   //keycode 82 = r R
      self.restart.call(self, event);   //在特定的作用域中调用函数
    }
  });

  // Respond to button presses
  this.bindButtonPress(".retry-button", this.restart);   //最后定义了这个方法，第一个参数为类选择器
  this.bindButtonPress(".restart-button", this.restart);
  this.bindButtonPress(".keep-playing-button", this.keepPlaying);
/*   注释的这些是触摸屏事件，在不能用键盘的时候用。暂时先不管
  // Respond to swipe events
  var touchStartClientX, touchStartClientY;
  var gameContainer = document.getElementsByClassName("game-container")[0];

  gameContainer.addEventListener(this.eventTouchstart, function (event) {
    if ((!window.navigator.msPointerEnabled && event.touches.length > 1) ||
        event.targetTouches.length > 1) {
      return; // Ignore if touching with more than 1 finger
    }

    if (window.navigator.msPointerEnabled) {
      touchStartClientX = event.pageX;
      touchStartClientY = event.pageY;
    } else {
      touchStartClientX = event.touches[0].clientX;
      touchStartClientY = event.touches[0].clientY;
    }

    event.preventDefault();
  });

  gameContainer.addEventListener(this.eventTouchmove, function (event) {
    event.preventDefault();
  });

  gameContainer.addEventListener(this.eventTouchend, function (event) {
    if ((!window.navigator.msPointerEnabled && event.touches.length > 0) ||
        event.targetTouches.length > 0) {
      return; // Ignore if still touching with one or more fingers
    }

    var touchEndClientX, touchEndClientY;

    if (window.navigator.msPointerEnabled) {
      touchEndClientX = event.pageX;
      touchEndClientY = event.pageY;
    } else {
      touchEndClientX = event.changedTouches[0].clientX;
      touchEndClientY = event.changedTouches[0].clientY;
    }

    var dx = touchEndClientX - touchStartClientX;
    var absDx = Math.abs(dx);

    var dy = touchEndClientY - touchStartClientY;
    var absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 10) {
      // (right : left) : (down : up)
      self.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
    }
  });  */
};

KeyboardInputManager.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restart");
};

KeyboardInputManager.prototype.keepPlaying = function (event) {
  event.preventDefault();
  this.emit("keepPlaying");
};

KeyboardInputManager.prototype.bindButtonPress = function (selector, fn) {
  var button = document.querySelector(selector);  //querySelector为Document对象定义的成员（html5中）。返回匹配特定CSS选择器的第一个元素
  button.addEventListener("click", fn.bind(this));   //bind 是返回对应函数，便于稍后调用；apply 、call 则是立即调用
  //button.addEventListener(this.eventTouchend, fn.bind(this));
};
