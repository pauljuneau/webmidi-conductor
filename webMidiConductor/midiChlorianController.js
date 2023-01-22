/** 
    Copyright © 2021 - 2023 Paul Juneau All Rights Reserved.
**/

var isDiagnosticsOn = false;
////////////////////////////////////////////////////////////////////////////////////////
//                                     CONSTANTS                                      //
////////////////////////////////////////////////////////////////////////////////////////
const ACCEPTABLE_NOTE_NAMES = "C C#D D#E F F#G G#A A#B ";

const MidiInstrumentationEvents = {
    NOTEBEINGPLAYED:'noteBeingPlayed',
    NOTELASTPLAYED: 'noteLastPlayed',
    MIDICHLORIANCTRLEVENT : 'midiChlorianCtrlrEvent',
    PITCHEVENT : 'pitchEvent',
    CHORDINSCALEPLAYED : 'chordInScalePlayed',
    MISC_EVENT : 'miscellaneous'
}
Object.freeze(MidiInstrumentationEvents);
const CHORDS = {
    MAJOR_TRIAD:'Major Triad',
    MINOR_TRIAD: 'Minor Triad',
    AUGMENTED_TRIAD: 'Augmented Triad',
    DIMINISHED_TRIAD:'Diminished Triad',
    MAJOR_7TH:'Major 7th',
    MINOR_7TH:'Minor 7th',
    DOMINANT_7TH:'Dominant 7th', //aka major minor 7th
    MINOR_7TH_FLAT_5:'Minor 7th flat 5',
    DIMINISHED_7TH: 'Diminished 7th',
    MINOR_MAJOR_7TH: 'Minor-major 7th',
    MAJOR_7TH_SHARP_5 : 'Major 7 sharp 5' //aka augmented major 7th
}
Object.freeze(CHORDS);
const CHORD_PROGRESSION_TYPES = {
    MAJOR : 'Major',
    MINOR : 'Minor',
    HARMONIC_MINOR : 'Harmonic Minor',
    CUSTOM: 'Custom'
}
Object.freeze(CHORD_PROGRESSION_TYPES);
////////////////////////////////////////////////////////////////////////////////////////
//                           MIDI MESSAGE DATA DICTIONARIES                           //
////////////////////////////////////////////////////////////////////////////////////////
//TODO idea: move this into it's own static data models folder? with static parse method?
/**Midi Note Number Mapping Index of midi note number mapped to desktop keyboard key and note name. */
let MIDI_NOTE_NUMBER_MAPPING_INDEX = JSON.parse('[{"midiNoteNumber":"128","keyboardNumber":null,"noteName":"G#9/Ab9"},{"midiNoteNumber":"127","keyboardNumber":null,"noteName":"G9"},{"midiNoteNumber":"126","keyboardNumber":null,"noteName":"F#9/Gb9"},{"midiNoteNumber":"125","keyboardNumber":null,"noteName":"F9"},{"midiNoteNumber":"124","keyboardNumber":null,"noteName":"E9"},{"midiNoteNumber":"123","keyboardNumber":null,"noteName":"D#9/Eb9"},{"midiNoteNumber":"122","keyboardNumber":null,"noteName":"D9"},{"midiNoteNumber":"121","keyboardNumber":null,"noteName":"C#9/Db9"},{"midiNoteNumber":"120","keyboardNumber":null,"noteName":"C9"},{"midiNoteNumber":"119","keyboardNumber":null,"noteName":"B8"},{"midiNoteNumber":"118","keyboardNumber":null,"noteName":"A#8/Bb8"},{"midiNoteNumber":"117","keyboardNumber":null,"noteName":"A8"},{"midiNoteNumber":"116","keyboardNumber":null,"noteName":"G#8/Ab8"},{"midiNoteNumber":"115","keyboardNumber":null,"noteName":"G8"},{"midiNoteNumber":"114","keyboardNumber":null,"noteName":"F#8/Gb8"},{"midiNoteNumber":"113","keyboardNumber":null,"noteName":"F8"},{"midiNoteNumber":"112","keyboardNumber":null,"noteName":"E8"},{"midiNoteNumber":"111","keyboardNumber":null,"noteName":"D#8/Eb8"},{"midiNoteNumber":"110","keyboardNumber":null,"noteName":"D8"},{"midiNoteNumber":"109","keyboardNumber":null,"noteName":"C#8/Db8"},{"midiNoteNumber":"108","keyboardNumber":null,"noteName":"C8"},{"midiNoteNumber":"107","keyboardNumber":null,"noteName":"B7"},{"midiNoteNumber":"106","keyboardNumber":null,"noteName":"A#7/Bb7"},{"midiNoteNumber":"105","keyboardNumber":null,"noteName":"A7"},{"midiNoteNumber":"104","keyboardNumber":null,"noteName":"G#7/Ab7"},{"midiNoteNumber":"103","keyboardNumber":null,"noteName":"G7"},{"midiNoteNumber":"102","keyboardNumber":null,"noteName":"F#7/Gb7"},{"midiNoteNumber":"101","keyboardNumber":null,"noteName":"F7"},{"midiNoteNumber":"100","keyboardNumber":null,"noteName":"E7"},{"midiNoteNumber":"99","keyboardNumber":null,"noteName":"D#7/Eb7"},{"midiNoteNumber":"98","keyboardNumber":null,"noteName":"D7"},{"midiNoteNumber":"97","keyboardNumber":null,"noteName":"C#7/Db7"},{"midiNoteNumber":"96","keyboardNumber":null,"noteName":"C7"},{"midiNoteNumber":"95","keyboardNumber":null,"noteName":"B6"},{"midiNoteNumber":"94","keyboardNumber":null,"noteName":"A#6/Bb6"},{"midiNoteNumber":"93","keyboardNumber":null,"noteName":"A6"},{"midiNoteNumber":"92","keyboardNumber":null,"noteName":"G#6/Ab6"},{"midiNoteNumber":"91","keyboardNumber":null,"noteName":"G6"},{"midiNoteNumber":"90","keyboardNumber":null,"noteName":"F#6/Gb6"},{"midiNoteNumber":"89","keyboardNumber":null,"noteName":"F6"},{"midiNoteNumber":"88","keyboardNumber":null,"noteName":"E6"},{"midiNoteNumber":"87","keyboardNumber":null,"noteName":"D#6/Eb6"},{"midiNoteNumber":"86","keyboardNumber":null,"noteName":"D6"},{"midiNoteNumber":"85","keyboardNumber":null,"noteName":"C#6/Db6"},{"midiNoteNumber":"84","keyboardNumber":null,"noteName":"C6"},{"midiNoteNumber":"83","keyboardNumber":null,"noteName":"B5"},{"midiNoteNumber":"82","keyboardNumber":null,"noteName":"A#5/Bb5"},{"midiNoteNumber":"81","keyboardNumber":null,"noteName":"A5"},{"midiNoteNumber":"80","keyboardNumber":null,"noteName":"G#5/Ab5"},{"midiNoteNumber":"79","keyboardNumber":null,"noteName":"G5"},{"midiNoteNumber":"78","keyboardNumber":"BracketRight","noteName":"F#5/Gb5"},{"midiNoteNumber":"77","keyboardNumber":"Quote","noteName":"F5"},{"midiNoteNumber":"76","keyboardNumber":"Semicolon","noteName":"E5"},{"midiNoteNumber":"75","keyboardNumber":"KeyP","noteName":"D#5/Eb5"},{"midiNoteNumber":"74","keyboardNumber":"KeyL","noteName":"D5"},{"midiNoteNumber":"73","keyboardNumber":"KeyO","noteName":"C#5/Db5"},{"midiNoteNumber":"72","keyboardNumber":"KeyK","noteName":"C5"},{"midiNoteNumber":"71","keyboardNumber":"KeyJ","noteName":"B4"},{"midiNoteNumber":"70","keyboardNumber":"KeyU","noteName":"A#4/Bb4"},{"midiNoteNumber":"69","keyboardNumber":"KeyH","noteName":"A4 concert pitch"},{"midiNoteNumber":"68","keyboardNumber":"KeyY","noteName":"G#4/Ab4"},{"midiNoteNumber":"67","keyboardNumber":"KeyG","noteName":"G4"},{"midiNoteNumber":"66","keyboardNumber":"KeyT","noteName":"F#4/Gb4"},{"midiNoteNumber":"65","keyboardNumber":"KeyF","noteName":"F4"},{"midiNoteNumber":"64","keyboardNumber":"KeyD","noteName":"E4"},{"midiNoteNumber":"63","keyboardNumber":"KeyE","noteName":"D#4/Eb4"},{"midiNoteNumber":"62","keyboardNumber":"KeyS","noteName":"D4"},{"midiNoteNumber":"61","keyboardNumber":"KeyW","noteName":"C#4/Db4"},{"midiNoteNumber":"60","keyboardNumber":"KeyA","noteName":"C4 (middle C)"},{"midiNoteNumber":"59","keyboardNumber":null,"noteName":"B3"},{"midiNoteNumber":"58","keyboardNumber":null,"noteName":"A#3/Bb3"},{"midiNoteNumber":"57","keyboardNumber":null,"noteName":"A3"},{"midiNoteNumber":"56","keyboardNumber":null,"noteName":"G#3/Ab3"},{"midiNoteNumber":"55","keyboardNumber":null,"noteName":"G3"},{"midiNoteNumber":"54","keyboardNumber":null,"noteName":"F#3/Gb3"},{"midiNoteNumber":"53","keyboardNumber":null,"noteName":"F3"},{"midiNoteNumber":"52","keyboardNumber":null,"noteName":"E3"},{"midiNoteNumber":"51","keyboardNumber":null,"noteName":"D#3/Eb3"},{"midiNoteNumber":"50","keyboardNumber":null,"noteName":"D3"},{"midiNoteNumber":"49","keyboardNumber":null,"noteName":"C#3/Db3"},{"midiNoteNumber":"48","keyboardNumber":null,"noteName":"C3"},{"midiNoteNumber":"47","keyboardNumber":null,"noteName":"B2"},{"midiNoteNumber":"46","keyboardNumber":null,"noteName":"A#2/Bb2"},{"midiNoteNumber":"45","keyboardNumber":null,"noteName":"A2"},{"midiNoteNumber":"44","keyboardNumber":null,"noteName":"G#2/Ab2"},{"midiNoteNumber":"43","keyboardNumber":null,"noteName":"G2"},{"midiNoteNumber":"42","keyboardNumber":null,"noteName":"F#2/Gb2"},{"midiNoteNumber":"41","keyboardNumber":null,"noteName":"F2"},{"midiNoteNumber":"40","keyboardNumber":null,"noteName":"E2"},{"midiNoteNumber":"39","keyboardNumber":null,"noteName":"D#2/Eb2"},{"midiNoteNumber":"38","keyboardNumber":null,"noteName":"D2"},{"midiNoteNumber":"37","keyboardNumber":null,"noteName":"C#2/Db2"},{"midiNoteNumber":"36","keyboardNumber":null,"noteName":"C2"},{"midiNoteNumber":"35","keyboardNumber":null,"noteName":"B1"},{"midiNoteNumber":"34","keyboardNumber":null,"noteName":"A#1/Bb1"},{"midiNoteNumber":"33","keyboardNumber":null,"noteName":"A1"},{"midiNoteNumber":"32","keyboardNumber":null,"noteName":"G#1/Ab1"},{"midiNoteNumber":"31","keyboardNumber":null,"noteName":"G1"},{"midiNoteNumber":"30","keyboardNumber":null,"noteName":"F#1/Gb1"},{"midiNoteNumber":"29","keyboardNumber":null,"noteName":"F1"},{"midiNoteNumber":"28","keyboardNumber":null,"noteName":"E1"},{"midiNoteNumber":"27","keyboardNumber":null,"noteName":"D#1/Eb1"},{"midiNoteNumber":"26","keyboardNumber":null,"noteName":"D1"},{"midiNoteNumber":"25","keyboardNumber":null,"noteName":"C#1/Db1"},{"midiNoteNumber":"24","keyboardNumber":null,"noteName":"C1"},{"midiNoteNumber":"23","keyboardNumber":null,"noteName":"B0"},{"midiNoteNumber":"22","keyboardNumber":null,"noteName":"A#0/Bb0"},{"midiNoteNumber":"21","keyboardNumber":null,"noteName":"A0"},{"midiNoteNumber":"20","keyboardNumber":null,"noteName":""},{"midiNoteNumber":"19","keyboardNumber":null,"noteName":""},{"midiNoteNumber":"18","keyboardNumber":null,"noteName":""},{"midiNoteNumber":"17","keyboardNumber":null,"noteName":""},{"midiNoteNumber":"16","keyboardNumber":null,"noteName":""},{"midiNoteNumber":"15","keyboardNumber":null,"noteName":""},{"midiNoteNumber":"14","keyboardNumber":null,"noteName":""},{"midiNoteNumber":"13","keyboardNumber":null,"noteName":""},{"midiNoteNumber":"12","keyboardNumber":null,"noteName":""},{"midiNoteNumber":"11","keyboardNumber":null,"noteName":""},{"midiNoteNumber":"10","keyboardNumber":null,"noteName":""},{"midiNoteNumber":"9","keyboardNumber":null,"noteName":""},{"midiNoteNumber":"8","keyboardNumber":null,"noteName":""},{"midiNoteNumber":"7","keyboardNumber":null,"noteName":""},{"midiNoteNumber":"6","keyboardNumber":null,"noteName":""},{"midiNoteNumber":"5","keyboardNumber":null,"noteName":""},{"midiNoteNumber":"4","keyboardNumber":null,"noteName":""},{"midiNoteNumber":"3","keyboardNumber":null,"noteName":""},{"midiNoteNumber":"2","keyboardNumber":null,"noteName":""},{"midiNoteNumber":"1","keyboardNumber":null,"noteName":""},{"midiNoteNumber":"0","keyboardNumber":null,"noteName":""}]');
let stepCombinationByChordName = new Map();
stepCombinationByChordName.set(CHORDS.MAJOR_TRIAD,43);
stepCombinationByChordName.set(CHORDS.MINOR_TRIAD,34);
stepCombinationByChordName.set(CHORDS.AUGMENTED_TRIAD,44);
stepCombinationByChordName.set(CHORDS.DIMINISHED_TRIAD,33);
stepCombinationByChordName.set(CHORDS.MAJOR_7TH,434);
stepCombinationByChordName.set(CHORDS.MAJOR_7TH_SHARP_5,443);
stepCombinationByChordName.set(CHORDS.MINOR_7TH,343);
stepCombinationByChordName.set(CHORDS.DOMINANT_7TH,433);
stepCombinationByChordName.set(CHORDS.MINOR_7TH_FLAT_5,334);
stepCombinationByChordName.set(CHORDS.DIMINISHED_7TH,333);
stepCombinationByChordName.set(CHORDS.MINOR_MAJOR_7TH,344);
let KEYBOARD_KEY_TO_MIDI_NUMBER = new Map();
let NOTE_NAME_BY_MIDI_NUMBER = new Map();
let noteObjectByMidiNoteNumber = new Map();
let noteObjectOnByMidiNoteNumber = new Map();
for(midiNoteHz of MIDI_NOTE_NUMBER_MAPPING_INDEX) {
    KEYBOARD_KEY_TO_MIDI_NUMBER.set(midiNoteHz.keyboardNumber,midiNoteHz.midiNoteNumber);
    NOTE_NAME_BY_MIDI_NUMBER.set(midiNoteHz.midiNoteNumber,midiNoteHz.noteName);
    let oneNoteObj = new NoteObject(
        Number(midiNoteHz.midiNoteNumber), 
        midiNoteHz.noteName, 
        getNoteNameFromNumber(midiNoteHz.midiNoteNumber).trim()
    );
    noteObjectByMidiNoteNumber.set(oneNoteObj.midiNoteNumber, oneNoteObj);
    //use timeout b/c loadChordLetterSets func leverages pushNextMidiNoteNumbersInScale in musicConductorCtrl which hasn't been loaded yet.
    setTimeout(() => {
        loadChordLetterSets(oneNoteObj.midiNoteNumber, stepCombinationByChordName.get(CHORDS.MAJOR_TRIAD), CHORDS.MAJOR_TRIAD);
        loadChordLetterSets(oneNoteObj.midiNoteNumber,stepCombinationByChordName.get(CHORDS.MINOR_TRIAD), CHORDS.MINOR_TRIAD);
        loadChordLetterSets(oneNoteObj.midiNoteNumber,stepCombinationByChordName.get(CHORDS.AUGMENTED_TRIAD), CHORDS.AUGMENTED_TRIAD);
        loadChordLetterSets(oneNoteObj.midiNoteNumber,stepCombinationByChordName.get(CHORDS.DIMINISHED_TRIAD), CHORDS.DIMINISHED_TRIAD);
        loadChordLetterSets(oneNoteObj.midiNoteNumber,stepCombinationByChordName.get(CHORDS.MAJOR_7TH), CHORDS.MAJOR_7TH);
        loadChordLetterSets(oneNoteObj.midiNoteNumber,stepCombinationByChordName.get(CHORDS.MINOR_7TH), CHORDS.MINOR_7TH);
        loadChordLetterSets(oneNoteObj.midiNoteNumber,stepCombinationByChordName.get(CHORDS.DOMINANT_7TH), CHORDS.DOMINANT_7TH);
        loadChordLetterSets(oneNoteObj.midiNoteNumber,stepCombinationByChordName.get(CHORDS.MINOR_7TH_FLAT_5), CHORDS.MINOR_7TH_FLAT_5);
        loadChordLetterSets(oneNoteObj.midiNoteNumber,stepCombinationByChordName.get(CHORDS.DIMINISHED_7TH), CHORDS.DIMINISHED_7TH);
        loadChordLetterSets(oneNoteObj.midiNoteNumber,stepCombinationByChordName.get(CHORDS.MINOR_MAJOR_7TH), CHORDS.MINOR_MAJOR_7TH);
    }, 2000);
}

////////////////////////////////////////////////////////////////////////////
//                  BASE MUSIC THEORY OBJECT MODELS                       //
////////////////////////////////////////////////////////////////////////////
var chordLetterSetByChordName = new Map();

/**
 * @description constructor function for NoteObject
 * @param {Integer} midiNoteNumber 
 * @param {String} noteName 
 * @param {String} letter 
 */
function NoteObject(midiNoteNumber, noteName, letter) {
    this.midiNoteNumber = midiNoteNumber;
    this.noteName = noteName;
    this.isOn = false;
    this.scaleDegreeASC = undefined;
    this.scaleDegreeDESC = undefined;
    this.letter = letter;
    /**
     * @param {Boolean} onState
     * @returns this for chaining (fluent pattern)
     */
    this.setIsOn = function(onState) {
        this.isOn = onState;
        if(this.isOn == true) {
            noteObjectOnByMidiNoteNumber.set(this.midiNoteNumber, this);
        }
        if(this.isOn == false) {
            noteObjectOnByMidiNoteNumber.delete(this.midiNoteNumber);
        }
        return this;
    }
}

/**
 * @description loads chordLetterSetByChordName map where duplicate chordName key instances are overwritten during load. 
 * @param {Integer} midiNoteNumber 
 * @param {Integer} chordHalfStepAlgorithm is a number sequence indicating half steps between notes in a chord
 * @param {String} chordName 
 */
function loadChordLetterSets(midiNoteNumber, chordHalfStepAlgorithm, chordName) {
    var letter = getNoteNameFromNumber(midiNoteNumber).trim();
    var chordMidiNumberArray = [midiNoteNumber];
    //pushNextMidiNoteNumbersInScale function located in musicConductorCtrl.js
    pushNextMidiNoteNumbersInScale(chordHalfStepAlgorithm,chordMidiNumberArray);
    var chordLetterSet = setRestrictedLetters(chordMidiNumberArray);
    chordLetterSetByChordName.set(letter+ ' '+chordName,chordLetterSet);
}

/**
 * @description constructor function that instantiates a chord via a chordName produced by the loadChordLetterSets function.
 * @param {String} chordName is a note letter + ' ' + one of the chord name's in the CHORDS "enum" frozen object  
 */
function ChordInstance(chordName) {
    this.name = chordName;
    this.letter = chordName.split(' ',1)[0];
    this.type = chordName.split(' ').slice(1).join(' ');
}

////////////////////////////////////////////////////////////////////////////////////////
//                                 DATA INPUT EVENTS                                  //
////////////////////////////////////////////////////////////////////////////////////////
// Each event type gets its own message published to the JS Queue and is processed in //
// its own function object frame call stack.                                          //
// References:                                                                        //
// Concurrency Model and Event Loop:                                                  //
//  - Event creates message in queue and processed in first in first out order        //
//  - Message processing by handler function objects                                  //
//  - Calling a function creates a new stack frame for that function's use.           //
//  - Main thread is locked until context queue message is processed                  //
//  https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#Event_loop      //
////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description event listeners for keydown events, pitch events, or midi events
 * @param1 event type
 * @param2 callback function 
 */
document.addEventListener('keydown', onKeyEventMockMIDIMessage);
document.addEventListener('keyup', onKeyEventMockMIDIMessage);
document.addEventListener(MidiInstrumentationEvents.PITCHEVENT, onPitchEvent);

if (navigator.requestMIDIAccess) {
    console.log('WebMIDI is supported in this browser.');
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

} else if(navigator.requestMIDIAccess) {
    console.log('Midi input has been disabled');
} else {
    console.log('WebMIDI is not supported in this browser.');
}

////////////////////////////////////////////////////////////////////////////////////////
//                       DATA INPUT EVENT HANDLER DISPATCHERS                         //
////////////////////////////////////////////////////////////////////////////////////////
// Data Input becomes an instance of a Midi Message Data Model class.                 //
////////////////////////////////////////////////////////////////////////////////////////

function onMIDISuccess(midiAccess) {
    var inputs = midiAccess.inputs;
    var outputs = midiAccess.outputs;
    for (var input of midiAccess.inputs.values()) {
        input.onmidimessage = getMIDIMessage;
    }
}

function onMIDIFailure() {
    console.log('Error: Could not access MIDI devices. Connect a device and refresh to try again.');
}

////////////////////////////////////////////////////////////////////////////////////////
//                              MIDI MESSAGE DATA MODELS                              //
////////////////////////////////////////////////////////////////////////////////////////
/**Midi Message */
class OnMidiMessageWrapper {
    constructor(rawMidimessage) {
        this.eventType = 'MIDI';
        this.rawMidimessage = rawMidimessage;
        this.command = rawMidimessage.data[0];
        this.note = rawMidimessage.data[1];
        this.velocity = rawMidimessage.data[2];
        this.noteName = assignNoteName(this);
        this.timeStamp = rawMidimessage.timeStamp;
    }
}

class OnKeyEventMidiMessageMock {
    constructor(ke) {
        this.eventType = 'KEYBOARD';
        this.ke = ke;
        this.keyCode = ke.code;
        this.command = 144;
        this.note = KEYBOARD_KEY_TO_MIDI_NUMBER.get(this.keyCode);
        this.isRepeatNote = isRepeatNote(this);
        this.velocity = this.mockVelocity();
        this.noteName = assignNoteName(this);
        this.timeStamp = ke.timeStamp;
        this.isEmulatingDamper = this.isEmulatingDamper();
    }
    mockVelocity() {
        if(this.isRepeatNote && this.ke.repeat){
            return 0;
        } 
        if(this.ke.type == "keydown") {
            return this.ke.shiftKey === true ? 51 : 1;
        }
        return 0;
    }
    isEmulatingDamper() {
        var isEmulatingDamper = false;
        if(this.keyCode == "Space") {
            this.command = 176;
            this.note = 64;
            if(this.ke.type == "keydown" && this.isRepeatNote == false) {
                this.velocity = 51;
                isEmulatingDamper = true; 
            }
            if(this.ke.type == "keyup") {
                this.velocity = 0;
                isEmulatingDamper = true; 
            }
        }
        
        return isEmulatingDamper;
    }
}

class OnPitchEventMidiMessageDTO {
    constructor(pitchEventValue) {
        this.eventType = 'PITCH';
        this.pitchEventValue = pitchEventValue;
        this.pitchJsModelObj = JSON.parse(pitchEventValue);
        this.command = 144;
        this.note = this.pitchJsModelObj.midiNote;
        this.velocity = this.mockVelocity();
        this.noteName = assignNoteName(this);
        this.timeStamp = pitchEventValue.timeStamp;
    }
    mockVelocity() {
        if(isRepeatNote(this)) return 0;
        return 51;
    }
}

function isRepeatNote(midiWrapperObject) {
    let dataInputCache = new SessionCache();
    let noteLastPlayed = dataInputCache.get(MidiInstrumentationEvents.NOTELASTPLAYED);
    if(noteLastPlayed == "DNE" || noteLastPlayed === "undefined") {
        console.log('noteLastPlayed not recorded yet');
        return false;
    }

    noteLastPlayed = JSON.parse(noteLastPlayed);

    if(noteLastPlayed === "undefined") {
        console.log('Empty noteLastPayed');
        return false;
    }

    if(noteLastPlayed.note == midiWrapperObject.note) {
        console.log('isRepeatNote');
        return true;
    }

    let noteBeingPlayed = dataInputCache.get(MidiInstrumentationEvents.NOTEBEINGPLAYED);
    if(noteBeingPlayed != "DNE" || noteBeingPlayed !== "undefined") {
        //console.log(noteBeingPlayed);
        noteBeingPlayed = JSON.parse(noteBeingPlayed);
        if(noteBeingPlayed !== "undefined" && noteBeingPlayed.note == midiWrapperObject.note) {
            return true;
        }
    }
}

function assignNoteName(midiMessage) {
    let tempNote = getNoteValue(midiMessage.note);
    if(NOTE_NAME_BY_MIDI_NUMBER.has(tempNote)) { 
        return NOTE_NAME_BY_MIDI_NUMBER.get(tempNote); 
    }
    return getNoteNameFromNumber(midiMessage.note);  
}

function getNoteValue(note) {
    let tempNote;
    try {
        tempNote = note.toString();
    } catch (error) {
        return 'undefined';
    }
    return tempNote;
}

/**
 * @description GET NOTE NAME FROM MIDI NOTE NUMBER                                  
 * @param noteNum midiNoteNumber 
 */
const ACCEPTABLE_NOTE_NAMES_ARRAY = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',"C"];
function indexOfNoteLetter(value, index, array) {
    return value == noteLetterToFindIndexOf;
}
var noteLetterToFindIndexOf = 'C';

/**
 * @description converts midi number to a note name.
 * @param {Integer} noteNum - midi number
 * @param {Boolean} [doTrim=false] - will trim white spaces from note name if true is provided  
 * @returns note name
 * @see https://stackoverflow.com/questions/712679/convert-midi-note-numbers-to-name-and-octave
 */
function getNoteNameFromNumber(noteNum, doTrim) {
    var notes = ACCEPTABLE_NOTE_NAMES;
    var octave;
    var note;

    octave = Math.floor(noteNum / 12 - 1);
    note = notes.substring((noteNum % 12) * 2, (noteNum % 12) * 2 + 2);
    if(doTrim) {
        note = note.trim()
    }
   return note;

}

////////////////////////////////////////////////////////////////////////////////////////
//                            MIDI MESSAGE EVENT HANDLERS                             //
////////////////////////////////////////////////////////////////////////////////////////
/**
 * @description takes in MIDIMessageEvent message, creates wrapper object, and passes to main method
 * @param {MIDIMessageEvent} message 
 * Sample MIDIMessage data:
 * [144, 60, 55] turn on note 60 with velocity 55; timeStamp ~ 11611.72 ms
 * [144, 60, 0]  turn off note 60; timeStamp ~ 11821.72 ms
 * timeNotePlayedInSeconds = (11821.72 - 11611.72)/1000 = .21 s
 * @see https://webaudio.github.io/web-midi-api/#MIDIMessageEvent
 */
function getMIDIMessage(message) {
    var omm = new OnMidiMessageWrapper(message);
    main(omm);
}

/**
 * @description mocks midi message input from key event, and passes to main method
 * @param {KeyboardEvent} keyEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
 */
function onKeyEventMockMIDIMessage(keyEvent) {
    var mockMidi = new OnKeyEventMidiMessageMock(keyEvent);
    main(mockMidi);
}

/**
 * 
 * @param {PitchJsModel} e events accepted and then transformed into MidiMessage
 * compatible with https://github.com/pauljuneau/PitchDetectMirror release(s): v1.1.0
 */
function onPitchEvent(e) {
    var pitchToMidiDTO = new OnPitchEventMidiMessageDTO(e.value);
    main(pitchToMidiDTO);
}

////////////////////////////////////////////////////////////////////////////////////////
//                          MAIN MIDI MESSAGE EVENT PROCESSOR                         //
////////////////////////////////////////////////////////////////////////////////////////
/**                                 SESSION CACHE                                    **/

/** sessionStorage setItem method aliased as an originalSetItem object */
var originalSetItem = sessionStorage.setItem;
/** 
 * @description Overrides default setItem sessionStorage method to first dispatch event
 * and then updates the sessionStorage its setItem method alias, originalSetItem. 
 */   
sessionStorage.setItem = function(key, value) {
    //if SessionItem publishes event on commit, then do so  
    for(attribute in MidiInstrumentationEvents) {
        if(key == MidiInstrumentationEvents[attribute]){
            var event = new Event(key);
            event.value = value;
            event.key = key;
            document.dispatchEvent(event);
            break;
        }
    } 
    originalSetItem.apply(this, arguments);
};
class SessionCache {
    constructor() {
        // Check browser support
        if(typeof(Storage)  === "undefined") {
            console.log("Sorry, your browser does not support Web Storage...");
            //TODO idea: throw alert that program will not work without session storage
        }  
    }
    set(sessionStorageKey, sessionStorageValue) {
        sessionStorage.setItem(sessionStorageKey, sessionStorageValue);
    }
    get(sessionStorageKey) {
        let itemData = 'blank';
        itemData = sessionStorage.getItem(sessionStorageKey);
        if(itemData === null || itemData == undefined ) itemData = "DNE";
        return itemData;
    }
}

//Clear last note played from cache when script is refreshed. 
var init;
if(init !== "done") {
    let tempCache = new SessionCache();
    let undf;
    tempCache.set(MidiInstrumentationEvents.NOTELASTPLAYED,undf);
    init = "done";
}

var midiInputHistory = [];
/**                                    MAIN FUNC                                              */
/**
 * @description receives Pitch, Keyboard, or Midi message data that shares a common model.
 *  - Updates related note in global map to be on/off.
 *  - Tracks note last played and note playing in enhanced session cache.
 *  - Updates midiChlorianCtrl to indicate damper pedal is on or off.
 * @param {Object} midiInput - Pitch, Keyboard, or Midi message data
 * @fires MidiInstrumentationEvents NOTELASTPLAYED & NOTEBEINGPLAYED
 */
function main(midiInput) {
    let diagnostics = 'Command: ' + midiInput.command +' , NoteNumb: ' + midiInput.note + 
        ' , Velocity: ' + midiInput.velocity + ' , NoteLetter: ' + midiInput.noteName +
        ' , TimeStamp: '+ midiInput.timeStamp;
    //Ignore Timing Clock (248) && Active Sensing (254). See https://fmslogo.sourceforge.io/manual/midi-table.html
    if(isDiagnosticsOn & midiInput.command != 248 && midiInput.command != 254) {
        console.log(midiInput);
        midiInputHistory.push(midiInput);
    }
    switch (midiInput.command) {
        case 144: // Note On
            handleMidiNote(midiInput);
            break;
        case 145: // Note On
            handleMidiNote(midiInput);
            break;
        case 176: // Control Change
            //Damper Pedal (64)
            if(midiInput.note == 64) {
                if(midiInput.velocity > 0) 
                midiChlorianCtrlr.isDamperOn = true;
                else midiChlorianCtrlr.isDamperOn = false;
            }
            break;
    }
}

/**
 * @description receives midiInput that has Note On commands.
 * @param {Object} midiInput 
 * @fires MidiInstrumentationEvents NOTELASTPLAYED & NOTEBEINGPLAYED
 */
function handleMidiNote(midiInput) {
    // LOAD SESSION CACHE FOR USE BY UI COMPONENT SUBSCRIBERS
    var dataInputCache = new SessionCache();
            
    var midiInputJson = JSON.stringify(midiInput);
    if(isDiagnosticsOn) {
        console.log(diagnostics);
    }
    //Note disengaged
    if(midiInput.velocity == 0) {
        if(midiInput.eventType != 'KEYBOARD' && midiInput.eventType != "PITCH") {
            try {
                let oneNoteObj = noteObjectByMidiNoteNumber.get(Number(midiInput.note));
                oneNoteObj.setIsOn(false);
            } catch(err) {
                let errStr = err.stack + ', MIDI Input: '+midiInputJson;
                console.log('cannot set note object isOn property to false. Details: ' + errStr);
            }
        }
        dataInputCache.set(MidiInstrumentationEvents.NOTELASTPLAYED, midiInputJson);
    }
    //Note engaged
    if(midiInput.velocity > 0) {
        if(midiInput.eventType == "PITCH") {
            var noteLastPlayed = dataInputCache.get(MidiInstrumentationEvents.NOTELASTPLAYED);
            if(noteLastPlayed == "DNE" || noteLastPlayed === "undefined") {
                dataInputCache.set(MidiInstrumentationEvents.NOTELASTPLAYED, midiInputJson);
            }
        }
        if(midiInput.eventType != 'KEYBOARD') {
            try {
                let oneNoteObj = noteObjectByMidiNoteNumber.get(Number(midiInput.note));
                oneNoteObj.setIsOn(true);
                if(midiInput.eventType == "PITCH") {
                    setTimeout(function turnOffPitch(counter){ 
                        //turn off pitch if it's playing continuously at same pitch for ~10 minutes to prevent memory leak 
                        if(counter === undefined) {
                            counter = 0;
                        }
                        if(midiChlorianCtrlr.midiInputPlaying != undefined && oneNoteObj != undefined) {
                            if(counter != 600 && Number(midiChlorianCtrlr.midiInputPlaying.note) == oneNoteObj.midiNoteNumber) {
                                counter++;
                                setTimeout(turnOffPitch,1000, counter);
                            }
                            oneNoteObj.setIsOn(false);
                        }
                    }, 
                    1000);
                }
            } catch(err) {
                let errStr = err.stack + ', MIDI Input: '+midiInputJson;
                console.log('cannot set note object isOn property to true. Details: ' + errStr);
            }
        }
        dataInputCache.set(MidiInstrumentationEvents.NOTEBEINGPLAYED, midiInputJson);
    }
    if(midiInput.eventType == 'KEYBOARD') {
        if(midiInput.ke.type == "keyup") {
            try {
                let oneNoteObj = noteObjectByMidiNoteNumber.get(Number(midiInput.note));
                oneNoteObj.setIsOn(false);
            } catch(err) {
                let errStr = err.stack + ', MIDI Input: '+midiInputJson;
                console.log('cannot set note object isOn property to false. Details: ' + errStr);
            }
        }
        if(midiInput.ke.type == "keydown") {
            try {
                let oneNoteObj = noteObjectByMidiNoteNumber.get(Number(midiInput.note));
                oneNoteObj.setIsOn(true);
            } catch(err) {
                let errStr = err.stack + ', MIDI Input: '+midiInputJson;
                console.log('cannot set note object isOn property to true. Details: ' + errStr);
            }
        }
    }
}

var midiChlorianCtrlr = {
    //countByNoteLastFullyPlayed measures count based on note previously played fully (press + release) instead of seeing if new note played has changed regardless of previous note's release 
    countByNoteLastFullyPlayed : false,
    countIncreased : false,
    countDecreased : false,
    countSame : false,
    frequencyIncreased : false,
    midiInputPlayedLast : undefined,
    midiInputPlaying : undefined,
    isDamperOn : false,
    //MIDI_NOTE_NUMBER_MAPPING_INDEX[0].midiNoteNumber = 128 (G#9/Ab9) high up piano
    highestMidiNoteNumber : parseInt(MIDI_NOTE_NUMBER_MAPPING_INDEX[0].midiNoteNumber),
    //MIDI_NOTE_NUMBER_MAPPING_INDEX[128].midiNoteNumber = 0 (null) lowest in piano
    lowestMidiNoteNumber : parseInt(MIDI_NOTE_NUMBER_MAPPING_INDEX[MIDI_NOTE_NUMBER_MAPPING_INDEX.length - 1].midiNoteNumber)
};

////////////////////////////////////////////////////////////////////////////////////////
//                         MIDI-CHLORIAN CONTROLLER EVENT HUB                         //
////////////////////////////////////////////////////////////////////////////////////////
/** 
 * @description listens to note being played event, updates midi-chlorian controller,
 *  stringifies it, and publishes midi-chlorian controller event.
 * @listens MidiInstrumentationEvents.NOTEBEINGPLAYED - published from main function.
 * @param e.value - stringified midiInput 
 * @fires MidiInstrumentationEvents.MIDICHLORIANCTRLEVENT - stringified midiChlorianCtrlr
 */

document.addEventListener(MidiInstrumentationEvents.NOTEBEINGPLAYED, function(e) {
    const midiInput = JSON.parse(e.value);
    
    var dataInputCache = new SessionCache();
    
    if(isDiagnosticsOn) {
        console.log('noteBeingPlayed');
        console.log(midiInput);
    }
    //default condition
    if(midiChlorianCtrlr.countByNoteLastFullyPlayed == false) {
        if(midiChlorianCtrlr.midiInputPlaying != undefined) {
            if ( midiInput.note > midiChlorianCtrlr.midiInputPlaying.note ) {
                midiChlorianCtrlr.countIncreased = true;
                midiChlorianCtrlr.countDecreased = false;
            } else if ( midiInput.note < midiChlorianCtrlr.midiInputPlaying.note ) {
                midiChlorianCtrlr.countIncreased = false;
                midiChlorianCtrlr.countDecreased = true;
            } else {
                midiChlorianCtrlr.countIncreased = false;
                midiChlorianCtrlr.countDecreased = false;
            }
        }
        midiChlorianCtrlr.midiInputPlaying = midiInput;

        dataInputCache.set(MidiInstrumentationEvents.MIDICHLORIANCTRLEVENT, JSON.stringify(midiChlorianCtrlr));
    } else {
        //Define midiInputPlaying right away in case wanting to measure action off first notes played that aren't released
        midiChlorianCtrlr.midiInputPlaying = midiInput;
        
        var noteLastPlayed = dataInputCache.get(MidiInstrumentationEvents.NOTELASTPLAYED);
        if(noteLastPlayed == "DNE" || noteLastPlayed === "undefined") {
            console.log('exiting event');
            return;
        }

        noteLastPlayed = JSON.parse(noteLastPlayed);

        if(noteLastPlayed === "undefined") {
            console.log('exiting event');
            return;
        }

        let noteTransitionTime = midiInput.timeStamp - noteLastPlayed.timeStamp;

        if(isDiagnosticsOn) {
            console.log('noteLastPlayed');
            console.log(noteLastPlayed);
            console.log('noteBeingPlayed: '+ midiInput.note +'. noteLastPlayed: '+ noteLastPlayed.note);
            console.log('noteTransitionTime '+noteTransitionTime);
        }

        if ( midiInput.note > noteLastPlayed.note ) {
            midiChlorianCtrlr.countIncreased = true;
            midiChlorianCtrlr.countDecreased = false;
        } else if ( midiInput.note < noteLastPlayed.note ) {
            midiChlorianCtrlr.countIncreased = false;
            midiChlorianCtrlr.countDecreased = true;
        } else {
            midiChlorianCtrlr.countIncreased = false;
            midiChlorianCtrlr.countDecreased = false;
        }
        midiChlorianCtrlr.midiInputPlayedLast = noteLastPlayed;

        dataInputCache.set(MidiInstrumentationEvents.MIDICHLORIANCTRLEVENT, JSON.stringify(midiChlorianCtrlr));
    } 
});