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
