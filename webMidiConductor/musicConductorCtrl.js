/** 
    Copyright © 2021 Paul Juneau All Rights Reserved.
**/

//DEPENDS ON ..\webMidiConductor\midiChlorianController.js having been loaded first!!!
////////////////////////////////////////////////////////////////////////////
//                          MUSIC THOERY RULES                            //
////////////////////////////////////////////////////////////////////////////
var currentKey = 'C';
var scaleType = 'major';

//assumes heptatonic (seven-note) scales that with scale degrees 1->7
let scaleToHalfStepAlgorithm = new Map();
scaleToHalfStepAlgorithm.set('major',2212221);
scaleToHalfStepAlgorithm.set('natural minor',2122122);
scaleToHalfStepAlgorithm.set('harmonic minor',2122131);
scaleToHalfStepAlgorithm.set('melodic minor', 2122221);

/**
 * @description Constructs RestrictToScaleRule object using scaleShorthandName. 
 * @param {String} scaleShorthandName C-major, F#-melodic minor, etc.
 * @implements {evaluateRule()} All rules should have this method to allow dynamic rule calling via JS "duck typing". ie if it quacks, it's a duck 
 */
function RestrictToScaleRule(scaleShorthandName) {
    this.ruleName = "RestrictToScaleRule";
    //TODO idea: add this.isPass = true|false //initialize as false 
    this.scaleShorthandName = scaleShorthandName;
    //scaleShorthandNames: C-Major, C-Minor, etc. 
    this.restrictToScaleArray = scaleShorthandName.split('-');
    this.restrictedMusicKey = this.restrictToScaleArray[0];
    //midi note numbers in ascending order that are in the given scale
    this.restrictedMidiNoteNumbers = setRestrictedMidiNoteNumbers(this.restrictToScaleArray);
    //midi note numbers in descending order that are in the given scale
    this.restrictedMidiNoteNumbersDownscale = this.restrictToScaleArray[1] == 'melodic minor' ? 
        setRestrictedMidiNoteNumbers([this.restrictToScaleArray[0],'natural minor']) : this.restrictedMidiNoteNumbers;
    this.restrictedLetters = setRestrictedLetters(this.restrictedMidiNoteNumbers);
    this.restrictedLettersDownscale = setRestrictedLetters(this.restrictedMidiNoteNumbersDownscale);
    //scale degrees when progressing up the scale, ASC, versus down the scale, DESC
    this.scaleDegreeByLetterASC = new Map();
    this.scaleDegreeByLetterDESC = new Map();
    this.getScaleDegreeByLetter = function(midiNoteNumbers) {
        var scaleDegree = 1;
        var returnMap = new Map();
        for (let i = 0; i < midiNoteNumbers.length; i++) {
            var oneMidiNoteNumber = midiNoteNumbers[i];
            if(scaleDegree > 7) break;
            returnMap.set(getNoteNameFromNumber(oneMidiNoteNumber).trim(), scaleDegree);
            scaleDegree++;
        }
        return returnMap;
    };
    /**
     * @description determines if given note is in restricted scale or not while considering if note is going up or down in pitch (e.g. melodic minor)
     * @param {midiChlorianCtrlr} oneMidiChlorianCtrlrEvent is a midiChlorianCtrlr object published in an event from midiChlorianController
     */
    this.evaluateRule = function(oneMidiChlorianCtrlrEvent) {
        //return true if oneMidiChlorianCtrlrEvent.midiInputPlaying is in restrictedMidiNoteNumbers
        let midiNoteNumberToCheck = oneMidiChlorianCtrlrEvent.midiInputPlaying.note;
        if(oneMidiChlorianCtrlrEvent.countDecreased) {
            return this.restrictedLettersDownscale.has(getNoteNameFromNumber(midiNoteNumberToCheck).trim());
        } 
        if (oneMidiChlorianCtrlrEvent.countIncreased) {
            return this.restrictedLetters.has(getNoteNameFromNumber(midiNoteNumberToCheck).trim());
        }
    };
}

/**
 * @description determines restricted midi notes in provided key scale in MIDI_NOTE_NUMBER_MAPPING_INDEX 
 * @param {String[]} restrictToScaleArray - index 0 = key (E.g. C); index 1 = scale name (E.g. Major)
 * @returns {Integer[]} restrictedMidiNoteNumbers integer array
 */
function setRestrictedMidiNoteNumbers(restrictToScaleArray, highestMidiNoteNumber) {
    //ASSUMPTIONS:
    if(highestMidiNoteNumber === undefined) {
       //MIDI_NOTE_NUMBER_MAPPING_INDEX[0].midiNoteNumber = 128 (G#9/Ab9) high up piano
        highestMidiNoteNumber = MIDI_NOTE_NUMBER_MAPPING_INDEX[0].midiNoteNumber; 
    }
    //MIDI_NOTE_NUMBER_MAPPING_INDEX[128].midiNoteNumber = 0 (null) lowest in piano
    var lowestMidiNoteNumber = MIDI_NOTE_NUMBER_MAPPING_INDEX[MIDI_NOTE_NUMBER_MAPPING_INDEX.length - 1].midiNoteNumber;
    var restrictedMusicKey = restrictToScaleArray[0];
    var foundFirstNoteOccurance = false;
    var lowestMidiNoteNumberOccuranceInRestrictedKey;
    var upperBoundaryIndex = MIDI_NOTE_NUMBER_MAPPING_INDEX.length - 1;
    for( i = upperBoundaryIndex; i > 0 ; i-- ) { 
        var currentMidiNote = MIDI_NOTE_NUMBER_MAPPING_INDEX[i];
        var currentMidiNoteNumber = currentMidiNote.midiNoteNumber;
        if(foundFirstNoteOccurance == false) {
            try {
                if(getNoteNameFromNumber(currentMidiNote.midiNoteNumber).trim() == restrictedMusicKey.toUpperCase()) {
                    foundFirstNoteOccurance = true;
                    lowestMidiNoteNumberOccuranceInRestrictedKey = currentMidiNoteNumber;
                    break;
                }
            } catch(err) {
                console.log('could not convert midi number to note name. midiNoteNumber: '+midiNoteNumber+' '+err.message);
            }
        }
    }
    
    var runningMidiNoteNumber = lowestMidiNoteNumberOccuranceInRestrictedKey;
    var scaleAlgorithm = scaleToHalfStepAlgorithm.get(restrictToScaleArray[1]);
    var eligibleMidiNumbers = [runningMidiNoteNumber];
    //TODO Bug? eligible midi numbers can surpass highest midi number b/c of pushing 7 notes based on scaleAlgo per running midi note number
    while(parseInt(runningMidiNoteNumber) < parseInt(highestMidiNoteNumber)) {
        pushNextMidiNoteNumbersInScale(scaleAlgorithm, eligibleMidiNumbers);
        runningMidiNoteNumber = eligibleMidiNumbers[eligibleMidiNumbers.length - 1];
    }
    return eligibleMidiNumbers;
}

/**
 * @description Leverages pass by reference to append midiNoteNumbers to midiNumbersArray function parameter.
 * @param {Integer} scaleAlgorithm is a number sequence where each number represents a number of half steps to take. 
 * @param {String[]} midiNumbersArray will get one or more midiNoteNumbers appended based on the number of half steps provided in the scaleAlgorithm.
 * @returns void. 
 */
function pushNextMidiNoteNumbersInScale(scaleAlgorithm,midiNumbersArray) {
    var lastMidiNumberInArrayAsStr = midiNumbersArray[midiNumbersArray.length - 1];
    var lastMidiNumberInArray = parseInt(lastMidiNumberInArrayAsStr);
    var scaleAlgoStr = scaleAlgorithm.toString();
    for( i = 0; i < scaleAlgoStr.length; i++) {
        var halfStepCount = parseInt(scaleAlgoStr.charAt(i));
        lastMidiNumberInArray +=  halfStepCount;
        midiNumbersArray.push(lastMidiNumberInArray.toString());
    }
}

/**
 * @description reduces restrictedMidiNoteNumbers to restrictedLettersSet based on restricted scale
 * @param {Integer[]} restrictedMidiNoteNumbers integer array 
 * @returns {String Set()} restrictedLettersSet  
 */
function setRestrictedLetters(restrictedMidiNoteNumbers) {
    let restrictedLettersSet = new Set();
    for(restrictedMidiNoteNumber of restrictedMidiNoteNumbers) {
        restrictedLettersSet.add(getNoteNameFromNumber(restrictedMidiNoteNumber).trim());
    }
    return restrictedLettersSet; 
}

/**
 * @description assumes calling if scaleType is minor
   TODO idea: make stateless 
 */
function convertKeyToRelativeMajorFromMinor() {
    noteLetterToFindIndexOf = currentKey;
    let noteNameArray = ACCEPTABLE_NOTE_NAMES_ARRAY.map((x) => x);
    //remove repeating C
    noteNameArray.splice(12,1);

    let tempNoteLetterArrayIndex = noteNameArray.findIndex(indexOfNoteLetter);
    //convert back to relative major key
    tempNoteLetterArrayIndex += 3; 
    if(tempNoteLetterArrayIndex >= noteNameArray.length ) {
        tempNoteLetterArrayIndex = tempNoteLetterArrayIndex - noteNameArray.length;
    }
    return noteNameArray[tempNoteLetterArrayIndex];
}


var musicConductor = {
    performanceString : '',
    scaleRule : new RestrictToScaleRule(currentKey + '-' + scaleType),
    chordsPlaying : []
};
/**
 * @returns string of musical performance: 
 * i.e. note letter, instrumental note position, scaleDegree, chords playing  
 */
function setMusicalPerformanceString() {
    musicConductor.chordsPlaying = [];
    
    musicConductor.scaleRule.scaleDegreeByLetterASC = musicConductor.scaleRule.scaleDegreeByLetterASC.size != 0 ? musicConductor.scaleRule.scaleDegreeByLetterASC 
        : musicConductor.scaleRule.getScaleDegreeByLetter(musicConductor.scaleRule.restrictedMidiNoteNumbers);
    musicConductor.scaleRule.scaleDegreeByLetterDESC = musicConductor.scaleRule.scaleDegreeByLetterDESC.size != 0 ? musicConductor.scaleRule.scaleDegreeByLetterDESC 
        : musicConductor.scaleRule.getScaleDegreeByLetter(musicConductor.scaleRule.restrictedMidiNoteNumbersDownscale);
    
    var lettersPlaying = new Set();
    musicConductor.performanceString = '"noteName", "scaleDegreeASC", "scaleDegreeDESC"\n';
    for(noteObject_i of noteObjectOnByMidiNoteNumber.values()) {
        lettersPlaying.add(noteObject_i.letter);
        noteObject_i.scaleDegreeASC = musicConductor.scaleRule.scaleDegreeByLetterASC.get(noteObject_i.letter);
        noteObject_i.scaleDegreeDESC = musicConductor.scaleRule.scaleDegreeByLetterDESC.get(noteObject_i.letter);
        musicConductor.performanceString += '"'+noteObject_i.noteName+'", "'+noteObject_i.scaleDegreeASC+'", "'+noteObject_i.scaleDegreeDESC+'"\n';
    }
    var liveAudioInputEnabled = liveAudioInputEnabled || false;
    if(!liveAudioInputEnabled) {
        var chordsPlaying = [];
        for(chordName of chordLetterSetByChordName.keys()) {
            var oneChordLetterSet = chordLetterSetByChordName.get(chordName);
            if(oneChordLetterSet.size <= lettersPlaying.size) {
                var isMatch = true;
                for (letter of lettersPlaying) {
                    if (!oneChordLetterSet.has(letter)) {
                        isMatch = false;
                    }
                }
                if(isMatch) chordsPlaying.push(chordName);
            }
        }
        musicConductor.chordsPlaying = chordsPlaying;
        if(lettersPlaying.size >0 )
        musicConductor.performanceString += 'Chords Playing: '+ chordsPlaying.join(', ');
    }
} 