/** 
    Copyright © 2021 - 2022 Paul Juneau All Rights Reserved.
**/

//DEPENDS ON ..\webMidiConductor\midiChlorianController.js having been loaded first!!!
////////////////////////////////////////////////////////////////////////////
//                          MUSIC THOERY RULES                            //
////////////////////////////////////////////////////////////////////////////
var currentKey = 'C';
var scaleType = 'major';

let scaleToHalfStepAlgorithm = new Map();
scaleToHalfStepAlgorithm.set('major',2212221);
scaleToHalfStepAlgorithm.set('natural minor',2122122);
scaleToHalfStepAlgorithm.set('harmonic minor',2122131);
scaleToHalfStepAlgorithm.set('melodic minor', 2122221);
scaleToHalfStepAlgorithm.set('minor pentatonic', 32232);
scaleToHalfStepAlgorithm.set('major pentatonic', 22323);
scaleToHalfStepAlgorithm.set('major blues', 211323);
scaleToHalfStepAlgorithm.set('minor blues', 321132);
scaleToHalfStepAlgorithm.set('major bebop', 22121121);
scaleToHalfStepAlgorithm.set('minor bebop', 21112212);
//modal scales:
scaleToHalfStepAlgorithm.set('ionian', 2212221);
scaleToHalfStepAlgorithm.set('dorian', 2122212);
scaleToHalfStepAlgorithm.set('phrygian', 1222122);
scaleToHalfStepAlgorithm.set('lydian', 2221221);
scaleToHalfStepAlgorithm.set('mixolydian', 2212212);
scaleToHalfStepAlgorithm.set('aeolian', 2122122);
scaleToHalfStepAlgorithm.set('locrian', 1221222);

//TODO remove hard coding of key value pairs
let majorKeyChordProgressionMap = new Map();
majorKeyChordProgressionMap.set('1 Major Triad', (new Set()).add('2 Minor Triad').add('3 Minor Triad').add('4 Major Triad').add('5 Major Triad').add('6 Minor Triad').add('7 Diminished Triad'));
majorKeyChordProgressionMap.set('1 Major 7th', (new Set()).add('2 Minor 7th').add('3 Minor 7th').add('4 Major 7th').add('5 Dominant 7th').add('6 Minor 7th').add('7 Minor 7th flat 5'));
majorKeyChordProgressionMap.set('2 Minor Triad', (new Set()).add('1 Major Triad').add('5 Major Triad').add('7 Diminished Triad'));
majorKeyChordProgressionMap.set('2 Minor 7th', (new Set()).add('1 Major 7th').add('5 Dominant 7th').add('7 Minor 7th flat 5'));
majorKeyChordProgressionMap.set('3 Minor Triad', (new Set()).add('1 Major Triad').add('4 Major Triad').add('6 Minor Triad'));
majorKeyChordProgressionMap.set('3 Minor 7th', (new Set()).add('1 Major 7th').add('4 Major 7th').add('6 Minor 7th'));
majorKeyChordProgressionMap.set('4 Major Triad', (new Set()).add('1 Major Triad').add('2 Minor Triad').add('5 Major Triad').add('7 Diminished Triad'));
majorKeyChordProgressionMap.set('4 Major 7th', (new Set()).add('1 Major 7th').add('2 Minor 7th').add('5 Dominant 7th').add('7 Minor 7th flat 5'));
majorKeyChordProgressionMap.set('5 Major Triad', (new Set()).add('1 Major Triad').add('6 Minor Triad'));
majorKeyChordProgressionMap.set('5 Dominant 7th', (new Set()).add('1 Major 7th').add('6 Minor 7th'));
majorKeyChordProgressionMap.set('6 Minor Triad', (new Set()).add('1 Major Triad').add('2 Minor Triad').add('3 Minor Triad').add('4 Major Triad').add('5 Major Triad'));
majorKeyChordProgressionMap.set('6 Minor 7th', (new Set()).add('1 Major 7th').add('2 Minor 7th').add('3 Minor 7th').add('4 Major 7th').add('5 Dominant 7th'));
majorKeyChordProgressionMap.set('7 Diminished Triad', (new Set()).add('1 Major Triad'));
majorKeyChordProgressionMap.set('7 Minor 7th flat 5', (new Set()).add('1 Major 7th'));

//GAP ALERT!!!: With the minor key, the 6th and 7th scale degrees are variable when going up or down the scale, so the 6th and 7th chords should be determined if the current bar being played has it's pitch arching up or down. This scrutiny is being left out for the time being, so a decending or ascending only minor chord may be declared a valid chord progression regardless of the current bar's melodic contour.
//TODO determine 7th chord progressions for "rare" minor key chord progressions  
let minorKeyChordProgressionMap = new Map();
minorKeyChordProgressionMap.set('1 Minor Triad', (new Set()).add('2 Diminished Triad').add('2 Minor Triad').add('3 Major Triad').add('3 Augmented Triad').add('4 Minor Triad').add('4 Major Triad').add('5 Major Triad').add('5 Minor Triad').add('6 Major Triad').add('6 Diminished Triad').add('7 Diminished Triad').add('7 Major Triad'));
minorKeyChordProgressionMap.set('1 Minor 7th', (new Set()).add('2 Minor 7th flat 5').add('3 Major 7th').add('4 Minor 7th').add('5 Dominant 7th').add('6 Major 7th').add('7 Diminished 7th'));
minorKeyChordProgressionMap.set('2 Diminished Triad', (new Set()).add('1 Minor Triad').add('5 Major Triad').add('7 Diminished Triad'));
minorKeyChordProgressionMap.set('2 Minor Triad', (new Set()).add('1 Minor Triad').add('5 Minor Triad').add('7 Major Triad'));
minorKeyChordProgressionMap.set('2 Minor 7th flat 5', (new Set()).add('1 Minor 7th').add('5 Dominant 7th').add('7 Diminished 7th'));
minorKeyChordProgressionMap.set('3 Major Triad', (new Set()).add('1 Minor Triad').add('4 Minor Triad').add('6 Major Triad').add('7 Diminished Triad'));
minorKeyChordProgressionMap.set('3 Augmented Triad', (new Set()).add('1 Minor Triad').add('4 Major Triad').add('6 Diminished Triad').add('7 Major Triad'));
minorKeyChordProgressionMap.set('3 Major 7th', (new Set()).add('1 Minor 7th').add('4 Minor 7th').add('6 Major 7th').add('7 Diminished 7th'));
minorKeyChordProgressionMap.set('4 Minor Triad', (new Set()).add('1 Minor Triad').add('5 Major Triad').add('7 Diminished Triad'));
minorKeyChordProgressionMap.set('4 Major Triad', (new Set()).add('1 Minor Triad').add('5 Minor Triad').add('7 Major Triad'));
minorKeyChordProgressionMap.set('4 Minor 7th', (new Set()).add('1 Minor 7th').add('5 Dominant 7th').add('7 Diminished 7th'));
minorKeyChordProgressionMap.set('5 Major Triad', (new Set()).add('1 Minor Triad').add('6 Major Triad'));
minorKeyChordProgressionMap.set('5 Minor Triad', (new Set()).add('1 Minor Triad').add('6 Diminished Triad'));
minorKeyChordProgressionMap.set('5 Dominant 7th', (new Set()).add('1 Minor 7th').add('6 Major 7th'));
minorKeyChordProgressionMap.set('6 Major Triad', (new Set()).add('1 Minor Triad').add('3 Major Triad').add('4 Minor Triad').add('5 Major Triad').add('7 Diminished Triad'));
minorKeyChordProgressionMap.set('6 Diminished Triad', (new Set()).add('1 Minor Triad').add('3 Augmented Triad').add('4 Major Triad').add('5 Minor Triad').add('7 Major Triad'));
minorKeyChordProgressionMap.set('6 Major 7th', (new Set()).add('1 Minor 7th').add('3 Major 7th').add('4 Minor 7th').add('5 Dominant 7th').add('7 Diminished 7th'));
minorKeyChordProgressionMap.set('7 Diminished Triad', (new Set()).add('1 Minor Triad'));
minorKeyChordProgressionMap.set('7 Major Triad', (new Set()).add('1 Minor Triad'));
minorKeyChordProgressionMap.set('7 Diminished 7th', (new Set()).add('1 Minor 7th'));
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
    this.retrictedScale = this.restrictToScaleArray[1];
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
            if(scaleDegree > scaleToHalfStepAlgorithm.get(this.retrictedScale).toString().length) break;
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
        //Useful for evaluating note in scale when playing melodic minor in its classical representation
        if(oneMidiChlorianCtrlrEvent.countDecreased) {
            return this.restrictedLettersDownscale.has(getNoteNameFromNumber(midiNoteNumberToCheck).trim());
        } 
        //If same note played, then evaulate against restricted letters designated when pitch is increasing.
        //Fail scenario may occur when same note of melodic minor scale is played after having starting going down the scale. 
        //E.g. Note F in A melodic minor would be correct if having just played G, but if F was replayed then it would evaluate against the ascending scale notes which should be F#.
        return this.restrictedLetters.has(getNoteNameFromNumber(midiNoteNumberToCheck).trim());
    };
    /**
     * @description determines if the current note letter is in the scale regardless if progressing up or down the scal.
     * @param {String} letter is one of the possible note letter names found in the ACCEPTABLE_NOTE_NAMES_ARRAY in midiChlorianController.js 
     * @returns {Boolean} true or false
     */
    this.isInScaleAscOrDesc = function(letter) {
        return (this.restrictedLettersDownscale.has(letter) || this.restrictedLetters.has(letter));
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

/**
 * @description reassigns the current key scale type. 
 * Regenerates the music conductor's RestrictToScale rule.
 * @param {String} key [key=currentKey] - new desired key to play in
 * @param {String} scale [scale=scaleType] - new desired scale to play in
 * @returns void
 */
function changeKeyAndScale(key, scale) {
    currentKey = !key ? currentKey: key;
    scaleType = !scale ? scaleType : scale;
    var scaleShorthandName = currentKey + '-' + scaleType;
    var rule = new RestrictToScaleRule(scaleShorthandName);
    musicConductor.scaleRule = rule;
}

function isChordProgression() {
    if(musicConductor.lastChordPlayed != undefined && musicConductor.currentChordPlaying != undefined && musicConductor.lastChordPlayed.name != musicConductor.currentChordPlaying.name && musicConductor.scaleRule.isInScaleAscOrDesc(musicConductor.currentChordPlaying.letter) && musicConductor.scaleRule.isInScaleAscOrDesc(musicConductor.lastChordPlayed.letter)) {
        var lastScaleDegreeChordPlayedASC = musicConductor.scaleRule.scaleDegreeByLetterASC.get(musicConductor.lastChordPlayed.letter) + ' ' + musicConductor.lastChordPlayed.type;
        var currentScaleDegreeChordPlayedASC = musicConductor.scaleRule.scaleDegreeByLetterASC.get(musicConductor.currentChordPlaying.letter) + ' ' + musicConductor.currentChordPlaying.type;
        var lastScaleDegreeChordPlayedDESC = musicConductor.scaleRule.scaleDegreeByLetterDESC.get(musicConductor.lastChordPlayed.letter) + ' ' + musicConductor.lastChordPlayed.type;
        var currentScaleDegreeChordPlayedDESC = musicConductor.scaleRule.scaleDegreeByLetterDESC.get(musicConductor.currentChordPlaying.letter) + ' ' + musicConductor.currentChordPlaying.type;
        switch (musicConductor.chordProgressionType) {
            case 'Major':
                return (majorKeyChordProgressionMap.has(lastScaleDegreeChordPlayedASC) && majorKeyChordProgressionMap.get(lastScaleDegreeChordPlayedASC).has(currentScaleDegreeChordPlayedASC)) || (majorKeyChordProgressionMap.has(lastScaleDegreeChordPlayedDESC) && majorKeyChordProgressionMap.get(lastScaleDegreeChordPlayedDESC).has(currentScaleDegreeChordPlayedDESC));
            case 'Minor':
                return (minorKeyChordProgressionMap.has(lastScaleDegreeChordPlayedASC) && minorKeyChordProgressionMap.get(lastScaleDegreeChordPlayedASC).has(currentScaleDegreeChordPlayedASC)) || (minorKeyChordProgressionMap.has(lastScaleDegreeChordPlayedDESC) && minorKeyChordProgressionMap.get(lastScaleDegreeChordPlayedDESC).has(currentScaleDegreeChordPlayedDESC));
            default:
                return false;
        }
    }
}

var musicConductor = {
    performanceString : '',
    scaleRule : new RestrictToScaleRule(currentKey + '-' + scaleType),
    chordsPlaying : [],
    lastChordPlayed : undefined,
    currentChordPlaying : undefined,
    chordProgressionType : 'Major'
};
/**
 * @returns string of musical performance: 
 * i.e. note letter, instrumental note position, scaleDegree, chords playing  
 */
function setMusicalPerformanceString() {
    if(musicConductor.chordsPlaying.length > 0) {
        musicConductor.lastChordPlayed = new ChordInstance(musicConductor.chordsPlaying[musicConductor.chordsPlaying.length - 1]);
    }
    musicConductor.chordsPlaying = [];
    //lazy load scale degree letters ascending and descending
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
                if(isMatch) {
                    chordsPlaying.push(chordName);
                    musicConductor.currentChordPlaying = new ChordInstance(chordName);
                }
            }
        }
        musicConductor.chordsPlaying = chordsPlaying;
        if(lettersPlaying.size >0 ) {
            musicConductor.performanceString += 'Chords Playing: '+ chordsPlaying.join(', ') +'\n';
            if(musicConductor.chordsPlaying.length > 0) {
                if(isChordProgression()) {
                    console.log('Good Chord Progression!!');
                }
            }
        }
    }
}

var musicPerformanceTimerVar;
function switchOnOffMusicalPerformance(delay) {
    if(!musicPerformanceTimerVar) {
        setInterval(setMusicalPerformanceString, delay);
    } else {
        clearInterval(musicPerformanceTimerVar);
    }
}