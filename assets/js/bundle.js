/*!
 * xmas-2017
 *
 * Made with ❤ by Steve Ottoz <so@dev.so>
 *
 * Copyright (c) 2017 Steve Ottoz
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaults = {
  chars: 'abcdefghijklmnopqrstuvwxyz0123456789',
  speed: 75
};

var Letter = function () {
  function Letter(element) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Letter);

    this.el = element;
    this.original = element.textContent;
    this.options = Object.assign({}, defaults, options);
  }

  _createClass(Letter, [{
    key: 'start',
    value: function start() {
      var _this = this;

      this.stop();
      this.random();
      this.el.classList.add('scrambling');
      this.interval = setInterval(function () {
        if (typeof _this.next === 'function') {
          _this.next();
        } else {
          _this.random();
        }
      }, this.options.speed);
      return this;
    }
  }, {
    key: 'stop',
    value: function stop() {
      clearInterval(this.interval);
      delete this.interval;
      this.el.classList.remove('scrambling');
      return this;
    }
  }, {
    key: 'reveal',
    value: function reveal() {
      var _this2 = this;

      var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      return new Promise(function (resolve) {
        _this2.interval || _this2.start();
        setTimeout(function () {
          if (duration) {
            _this2.next = function () {
              _this2.stop();
              _this2.value = _this2.original;
              delete _this2.next;
              resolve();
            };
          } else {
            _this2.stop();
            _this2.value = _this2.original;
            resolve();
          }
        }, duration);
      });
    }
  }, {
    key: 'scramble',
    value: function scramble() {
      var _this3 = this;

      var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      return new Promise(function (resolve) {
        _this3.interval || _this3.start();
        setTimeout(function () {
          _this3.stop();
          resolve();
        }, duration);
      });
    }
  }, {
    key: 'random',
    value: function random() {
      var value = '';
      for (var i = 0; i < this.original.length; i++) {
        value += this.options.chars.charAt(Math.floor(Math.random() * this.options.chars.length));
      }
      return this.value = value;
    }
  }, {
    key: 'value',
    get: function get() {
      return this.el.textContent;
    },
    set: function set(value) {
      this.el.textContent = value;
    }
  }]);

  return Letter;
}();

var letterGrid = document.querySelector('.letter-grid');
var letters = [].slice.call(document.querySelectorAll('.letter'), 0);
var startButton = document.querySelector('.start-button');
var p = Promise.resolve();

var letterElements = [];

for (var i in letters) {
  var l = new Letter(letters[i]);
  l.scramble();
  letterElements.push(l);
}

startButton.addEventListener('click', start);

sleep(500).then(function () {
  document.documentElement.classList.add('loaded');
});

function start() {
  startButton.classList.add('hide');
  letterGrid.classList.remove('hide');

  var _loop = function _loop(_i) {
    var l = letterElements[_i];
    p = p.then(function () {
      return l.reveal(random(200, 400));
    });
    p = p.then(function () {
      l.el.classList.add('done');
      return Promise.resolve();
    });
    if (_i >= letterElements.length - 1) {
      p = p.then(function () {
        return sleep(1000);
      });
      p = p.then(function () {
        document.documentElement.classList.add('done');
      });
    }
  };

  for (var _i in letterElements) {
    _loop(_i);
  }
}

function sleep(duration) {
  return new Promise(function (resolve) {
    setTimeout(resolve, duration);
  });
}

function random() {
  var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  return Math.floor(Math.random() * (max - min + 1) + min);
}

var c = console;
c && c.log('\n      *\n     .#.\n    .###.\n   .#%##%.\n  .%##%###.\n .##%###%##.\n.merry  xmas.\n     and\n    happy\n    2018!\n  ');