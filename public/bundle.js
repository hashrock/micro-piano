(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Operator = require("@mohayonao/operator");
var ctx = new AudioContext();
function mtof(noteNumber) {
    return 440 * Math.pow(2, (noteNumber - 69) / 12);
}

window.onkeydown = function(e) {
    var index = key2Note(e.keyCode);
    if (index >= 0) {
        keyOn({
            noteNumber: 60 + index
        })
    }
}

window.onkeyup = function(e) {
    var index = key2Note(e.keyCode);
    if (index >= 0) {
        keyOff({
            noteNumber: 60 + index
        })
    }
}
var tones = {}
var keys = [
    90, 83, 88, 68, 67, 86, 71, 66, 72, 78, 74, 77,
    81, 50, 87, 51, 69, 82, 53, 84, 54, 89, 55, 85,
    73, 57, 79, 48, 80, 219, 187
]
var alias = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    188, 76, 190, 186, 191, 189, 221, 0, 0, 0, 0, 0
]
var noteName = [
    "c",
    "d-",
    "d",
    "e-",
    "e",
    "f",
    "g-",
    "g",
    "a-",
    "a",
    "b-",
    "b"
]
function key2Note(keyCode){
    if(keys.indexOf(keyCode) >= 0){
        return keys.indexOf(keyCode);
    }
    if(alias.indexOf(keyCode) >= 0){
        return alias.indexOf(keyCode);
    }
    return -1;
}

function note2NoteName(note){
    var n = note % 12;
    var oct = (note - n) / 12 - 1;
    return "o" + oct + noteName[n]
}

function keyOn(e) {
    var fm = tones[e.noteNumber];
    if (fm) {
        return;
    }
    var amp = ctx.createGain();
    amp.gain.value = 0.04;
    var op = new Operator(ctx);
    op.frequency.value = mtof(e.noteNumber);
    op.connect(amp);
    amp.connect(ctx.destination);
    op.start();
    tones[e.noteNumber] = op;
    var name = note2NoteName(e.noteNumber);
    document.querySelector(".notes").innerText = 
        Object.keys(tones).map(note2NoteName).join(" ");
}

function keyOff(e) {
    var fm = tones[e.noteNumber];
    if (fm) {
        var now = ctx.currentTime;
        fm.stop(now);
        delete tones[e.noteNumber];
    }
}

},{"@mohayonao/operator":2}],2:[function(require,module,exports){
module.exports = require("./lib");

},{"./lib":4}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OSCILLATOR = typeof Symbol !== "undefined" ? Symbol("OSCILLATOR") : "_@mohayonao/operator:OSCILLATOR";
exports.OSCILLATOR = OSCILLATOR;
var GAIN = typeof Symbol !== "undefined" ? Symbol("GAIN") : "_@mohayonao/operator:GAIN";
exports.GAIN = GAIN;
var ENVELOPES = typeof Symbol !== "undefined" ? Symbol("ENVELOPES") : "_@mohayonao/operator:ENVELOPES";

exports.ENVELOPES = ENVELOPES;

var Operator = (function () {
  function Operator(audioContext) {
    _classCallCheck(this, Operator);

    this[OSCILLATOR] = audioContext.createOscillator();
    this[GAIN] = audioContext.createGain();
    this[ENVELOPES] = {};
  }

  _createClass(Operator, [{
    key: "connect",
    value: function connect(destination) {
      this[OSCILLATOR].connect(this[GAIN]);
      this[GAIN].connect(destination);
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      var _GAIN;

      this[OSCILLATOR].disconnect();
      (_GAIN = this[GAIN]).disconnect.apply(_GAIN, arguments);
    }
  }, {
    key: "start",
    value: function start(when) {
      applyTo(this[ENVELOPES].frequency, this[OSCILLATOR].frequency, when);
      applyTo(this[ENVELOPES].detune, this[OSCILLATOR].detune, when);
      applyTo(this[ENVELOPES].gain, this[GAIN].gain, when);
      this[OSCILLATOR].start(when);
    }
  }, {
    key: "stop",
    value: function stop(when) {
      this[OSCILLATOR].stop(when);
    }
  }, {
    key: "setPeriodicWave",
    value: function setPeriodicWave(periodicWave) {
      this[OSCILLATOR].setPeriodicWave(periodicWave);
    }
  }, {
    key: "setEnvelope",
    value: function setEnvelope(envelope) {
      var target = arguments[1] === undefined ? "gain" : arguments[1];

      this[ENVELOPES][target] = envelope;
    }
  }, {
    key: "getEnvelope",
    value: function getEnvelope() {
      var target = arguments[0] === undefined ? "gain" : arguments[0];

      return this[ENVELOPES][target];
    }
  }, {
    key: "context",
    get: function get() {
      return this[OSCILLATOR].context;
    }
  }, {
    key: "type",
    get: function get() {
      return this[OSCILLATOR].type;
    },
    set: function set(value) {
      this[OSCILLATOR].type = value;
    }
  }, {
    key: "frequency",
    get: function get() {
      return this[OSCILLATOR].frequency;
    }
  }, {
    key: "detune",
    get: function get() {
      return this[OSCILLATOR].detune;
    }
  }, {
    key: "onended",
    get: function get() {
      return this[OSCILLATOR].onended;
    },
    set: function set(value) {
      this[OSCILLATOR].onended = value;
    }
  }, {
    key: "gain",
    get: function get() {
      return this[GAIN].gain;
    }
  }]);

  return Operator;
})();

exports["default"] = Operator;

function applyTo(envelope, audioParam, startTime) {
  if (envelope && typeof envelope.applyTo === "function") {
    envelope.applyTo(audioParam, startTime);
  }
}
},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _Operator = require("./Operator");

var _Operator2 = _interopRequireDefault(_Operator);

exports["default"] = _Operator2["default"];
module.exports = exports["default"];
},{"./Operator":3}]},{},[1]);
