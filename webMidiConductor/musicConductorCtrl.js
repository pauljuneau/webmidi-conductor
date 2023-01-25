/** 
    Copyright © 2021 - 2023 Paul Juneau All Rights Reserved.
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

let chordTypeDegrees = new Map();
for (let key in CHORDS) {
    let chordType = CHORDS[key];
    chordTypeDegrees.set(chordType,[]);
    for (let i = 0; i < 8; i++) {
        chordTypeDegrees.get(chordType).push(i + ' '+chordType);        
    }
}
//Collection of CHORD_PROGRESSION_TYPES (defined in midiChlorianController): Major, Minor, Custom, etc.
let chordProgressionMapByType = new Map();

//MAJOR Chord Progression Map
let majorKeyChordProgressionMap = new Map();
majorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[1], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[2]).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[3]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[4]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[5]).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[6]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[7]));

majorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[1], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_7TH)[2]).add(chordTypeDegrees.get(CHORDS.MINOR_7TH)[3]).add(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[4]).add(chordTypeDegrees.get(CHORDS.DOMINANT_7TH)[5]).add(chordTypeDegrees.get(CHORDS.MINOR_7TH)[6]).add(chordTypeDegrees.get(CHORDS.MINOR_7TH_FLAT_5)[7]));

majorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[2], (new Set()).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[1]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[5]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[7]));

majorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MINOR_7TH)[2], (new Set()).add(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[1]).add(chordTypeDegrees.get(CHORDS.DOMINANT_7TH)[5]).add(chordTypeDegrees.get(CHORDS.MINOR_7TH_FLAT_5)[7]));

majorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[3], (new Set()).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[1]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[4]).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[6]));

majorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MINOR_7TH)[3], (new Set()).add(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[1]).add(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[4]).add(chordTypeDegrees.get(CHORDS.MINOR_7TH)[6]));

majorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[4], (new Set()).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[1]).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[2]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[5]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[7]));

majorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[4], (new Set()).add(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[1]).add(chordTypeDegrees.get(CHORDS.MINOR_7TH)[2]).add(chordTypeDegrees.get(CHORDS.DOMINANT_7TH)[5]).add(chordTypeDegrees.get(CHORDS.MINOR_7TH_FLAT_5)[7]));

majorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[5], (new Set()).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[1]).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[6]));

majorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.DOMINANT_7TH)[5], (new Set()).add(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[1]).add(chordTypeDegrees.get(CHORDS.MINOR_7TH)[6]));

majorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[6], (new Set()).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[1]).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[2]).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[3]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[4]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[5]));

majorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MINOR_7TH)[6], (new Set()).add(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[1]).add(chordTypeDegrees.get(CHORDS.MINOR_7TH)[2]).add(chordTypeDegrees.get(CHORDS.MINOR_7TH)[3]).add(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[4]).add(chordTypeDegrees.get(CHORDS.DOMINANT_7TH)[5]));

majorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[7], (new Set()).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[1]));
majorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MINOR_7TH_FLAT_5)[7], (new Set()).add(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[1]));

chordProgressionMapByType.set(CHORD_PROGRESSION_TYPES.MAJOR,majorKeyChordProgressionMap);

//GAP ALERT!!!: With the minor key, the 6th and 7th scale degrees are variable when going up or down the scale, so the 6th and 7th chords should be determined if the current bar being played has it's pitch arching up or down. This scrutiny is being left out for the time being, so a decending or ascending only minor chord may be declared a valid chord progression regardless of the current bar's melodic contour.
//TODO determine 7th chord progressions for "rare" minor key chord progressions  
let minorKeyChordProgressionMap = new Map();
minorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[1], (new Set()).add(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[2]).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[2]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[3]).add(chordTypeDegrees.get(CHORDS.AUGMENTED_TRIAD)[3]).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[4]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[4]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[5]).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[5]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[6]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[6]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[7]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[7]));

minorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MINOR_7TH)[1], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_7TH_FLAT_5)[2]).add(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[3]).add(chordTypeDegrees.get(CHORDS.MINOR_7TH)[4]).add(chordTypeDegrees.get(CHORDS.DOMINANT_7TH)[5]).add(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[6]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_7TH)[7]));

minorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[2], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[1]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[5]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[7]));

minorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[2], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[1]).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[5]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[7]));

minorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MINOR_7TH_FLAT_5)[2], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_7TH)[1]).add(chordTypeDegrees.get(CHORDS.DOMINANT_7TH)[5]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_7TH)[7]));

minorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[3], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[1]).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[4]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[6]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[7]));

minorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.AUGMENTED_TRIAD)[3], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[1]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[4]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[6]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[7]));

minorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[3], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_7TH)[1]).add(chordTypeDegrees.get(CHORDS.MINOR_7TH)[4]).add(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[6]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_7TH)[7]));

minorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[4], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[1]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[5]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[7]));

minorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[4], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[1]).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[5]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[7]));

minorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MINOR_7TH)[4], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_7TH)[1]).add(chordTypeDegrees.get(CHORDS.DOMINANT_7TH)[5]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_7TH)[7]));

minorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[5], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[1]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[6]));

minorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[5], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[1]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[6]));

minorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.DOMINANT_7TH)[5], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_7TH)[1]).add(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[6]));

minorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[6], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[1]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[3]).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[4]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[5]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[7]));

minorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[6], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[1]).add(chordTypeDegrees.get(CHORDS.AUGMENTED_TRIAD)[3]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[4]).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[5]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[7]));

minorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[6], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_7TH)[1]).add(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[3]).add(chordTypeDegrees.get(CHORDS.MINOR_7TH)[4]).add(chordTypeDegrees.get(CHORDS.DOMINANT_7TH)[5]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_7TH)[7]));

minorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[7], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[1]));

minorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[7], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[1]));

minorKeyChordProgressionMap.set(chordTypeDegrees.get(CHORDS.DIMINISHED_7TH)[7], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_7TH)[1]));

chordProgressionMapByType.set(CHORD_PROGRESSION_TYPES.MINOR,minorKeyChordProgressionMap);

//harmonic minor chord progression
let harmonicMinorChordProgressionMap = new Map();
harmonicMinorChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[1], (new Set()).add(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[2]).add(chordTypeDegrees.get(CHORDS.AUGMENTED_TRIAD)[3]).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[4]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[5]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[6]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[7]));

harmonicMinorChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MINOR_MAJOR_7TH)[1], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_7TH_FLAT_5)[2]).add(chordTypeDegrees.get(CHORDS.MAJOR_7TH_SHARP_5)[3]).add(chordTypeDegrees.get(CHORDS.MINOR_7TH)[4]).add(chordTypeDegrees.get(CHORDS.DOMINANT_7TH)[5]).add(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[6]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_7TH)[7]));

harmonicMinorChordProgressionMap.set(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[2], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[1]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[5]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[7]));

harmonicMinorChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MINOR_7TH_FLAT_5)[2], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_MAJOR_7TH)[1]).add(chordTypeDegrees.get(CHORDS.DOMINANT_7TH)[5]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_7TH)[7]));

harmonicMinorChordProgressionMap.set(chordTypeDegrees.get(CHORDS.AUGMENTED_TRIAD)[3], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[1]).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[4]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[6]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[7]));

harmonicMinorChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MAJOR_7TH_SHARP_5)[3], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_MAJOR_7TH)[1]).add(chordTypeDegrees.get(CHORDS.MINOR_7TH)[4]).add(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[6]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_7TH)[7]));

harmonicMinorChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[4], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[1]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[5]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[7]));

harmonicMinorChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MINOR_7TH)[4], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_MAJOR_7TH)[1]).add(chordTypeDegrees.get(CHORDS.DOMINANT_7TH)[5]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_7TH)[7]));

harmonicMinorChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[5], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[1]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[6]));

harmonicMinorChordProgressionMap.set(chordTypeDegrees.get(CHORDS.DOMINANT_7TH)[5], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_MAJOR_7TH)[1]).add(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[6]));

harmonicMinorChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[6], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[1]).add(chordTypeDegrees.get(CHORDS.AUGMENTED_TRIAD)[3]).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[4]).add(chordTypeDegrees.get(CHORDS.MAJOR_TRIAD)[5]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[7]));

harmonicMinorChordProgressionMap.set(chordTypeDegrees.get(CHORDS.MAJOR_7TH)[6], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_MAJOR_7TH)[1]).add(chordTypeDegrees.get(CHORDS.MAJOR_7TH_SHARP_5)[3]).add(chordTypeDegrees.get(CHORDS.MINOR_7TH)[4]).add(chordTypeDegrees.get(CHORDS.DOMINANT_7TH)[5]).add(chordTypeDegrees.get(CHORDS.DIMINISHED_7TH)[7]));

harmonicMinorChordProgressionMap.set(chordTypeDegrees.get(CHORDS.DIMINISHED_TRIAD)[7], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_TRIAD)[1]));

harmonicMinorChordProgressionMap.set(chordTypeDegrees.get(CHORDS.DIMINISHED_7TH)[7], (new Set()).add(chordTypeDegrees.get(CHORDS.MINOR_MAJOR_7TH)[1]));


chordProgressionMapByType.set(CHORD_PROGRESSION_TYPES.HARMONIC_MINOR, harmonicMinorChordProgressionMap);

//Client is free to set values as they please to this map
let customChordProgressionMap = new Map();
chordProgressionMapByType.set(CHORD_PROGRESSION_TYPES.CUSTOM,customChordProgressionMap);

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

/**
 * @description determines if a good chord progression has occurred based on the current chord progression type. A good chord progression is defined as a chord with its governing note letter being in the given key, having a valid chord type (major, minor, diminished, augmented, etc) based on the scale degree of the chord's governing note letter, and if the previous chord played was classified as a good progression per the context chord progression type.
 * @fires MidiInstrumentationEvents.CHORDINSCALEPLAYED - stringified object containing string attributes of 'scaleDegree chordType' played with respect to the scale degrees in ASC and DESC order.
 * @returns true or false
 */
function isChordProgression() {
    //Assuming setMusicalPerformanceString is running every 100ms, so chords in lastChordsPlayed and currentchordsPlaying are almost guaranteed to be inversionally equivalent with the same chord types. Such as when an inverted variation of one chord can be equivalent to the root variation of another chord (C Aug Triad notes = G# Aug notes = E Aug Triad notes).
    //Therefor we only want to evaluate the chord with a root note that is the context scale and also has the appropriate chord type associated with its related scale degree.
    var chordProgressionMap = chordProgressionMapByType.get(musicConductor.chordProgressionType);
    if(chordProgressionMap == undefined || chordProgressionMap.size <= 0) {
        return false;
    }

    var lastChordsPlayed = new Set();
    for (const chord of musicConductor.lastChordsPlayed) {
        if(musicConductor.scaleRule.isInScaleAscOrDesc(chord.letter)) {
            var lastScaleDegreeChordPlayedASC = musicConductor.scaleRule.scaleDegreeByLetterASC.get(chord.letter) + ' ' + chord.type;
            var lastScaleDegreeChordPlayedDESC = musicConductor.scaleRule.scaleDegreeByLetterDESC.get(chord.letter) + ' ' + chord.type;
            if(chordProgressionMap.has(lastScaleDegreeChordPlayedASC) || chordProgressionMap.has(lastScaleDegreeChordPlayedDESC)) {
                lastChordsPlayed.add(chord);
            }
        }
    }
    
    var currentChordsPlaying = new Set();
    for (const chord of musicConductor.currentChordsPlaying) {
        if(musicConductor.scaleRule.isInScaleAscOrDesc(chord.letter)) {
            var currentScaleDegreeChordPlayedASC = musicConductor.scaleRule.scaleDegreeByLetterASC.get(chord.letter) + ' ' + chord.type;
            var currentScaleDegreeChordPlayedDESC = musicConductor.scaleRule.scaleDegreeByLetterDESC.get(chord.letter) + ' ' + chord.type;
            if(chordProgressionMap.has(currentScaleDegreeChordPlayedASC) || chordProgressionMap.has(currentScaleDegreeChordPlayedDESC)) {
                currentChordsPlaying.add(chord);
                var chordInScalePlayedEvent = {
                    scaleDegreeChordPlayedASC  : currentScaleDegreeChordPlayedASC,
                    scaleDegreeChordPlayedDESC :  currentScaleDegreeChordPlayedDESC
                };
                (new SessionCache()).set(MidiInstrumentationEvents.CHORDINSCALEPLAYED,JSON.stringify(chordInScalePlayedEvent));
            }
        }
    }
    //handle situation when there are multiple chords inversionally related that have a scale degree chord type in the chord progression map... try all permutations and break out of loops on first success.
    var isChordProgression = false;
    musicConductor.replayedSameChordInProgressionMap = false;
    if(lastChordsPlayed.size > 0 && currentChordsPlaying.size > 0) {
        for(const lastChordPlayed of lastChordsPlayed) {
            for(const currentChordPlaying of currentChordsPlaying) {
                if(lastChordPlayed != undefined && currentChordPlaying != undefined) {
                    musicConductor.replayedSameChordInProgressionMap = (lastChordPlayed.name == currentChordPlaying.name); 
                    if(musicConductor.replayedSameChordInProgressionMap == false) {
                        var lastScaleDegreeChordPlayedASC = musicConductor.scaleRule.scaleDegreeByLetterASC.get(lastChordPlayed.letter) + ' ' + lastChordPlayed.type;
                        var currentScaleDegreeChordPlayedASC = musicConductor.scaleRule.scaleDegreeByLetterASC.get(currentChordPlaying.letter) + ' ' + currentChordPlaying.type;
                        var lastScaleDegreeChordPlayedDESC = musicConductor.scaleRule.scaleDegreeByLetterDESC.get(lastChordPlayed.letter) + ' ' + lastChordPlayed.type;
                        var currentScaleDegreeChordPlayedDESC = musicConductor.scaleRule.scaleDegreeByLetterDESC.get(currentChordPlaying.letter) + ' ' + currentChordPlaying.type;
                        isChordProgression = (chordProgressionMap != undefined && chordProgressionMap.size > 0 && ((chordProgressionMap.has(lastScaleDegreeChordPlayedASC) && chordProgressionMap.get(lastScaleDegreeChordPlayedASC).has(currentScaleDegreeChordPlayedASC)) || (chordProgressionMap.has(lastScaleDegreeChordPlayedDESC) && chordProgressionMap.get(lastScaleDegreeChordPlayedDESC).has(currentScaleDegreeChordPlayedDESC))));
                    }
                }
                if(isChordProgression) break;
            }
            if(isChordProgression) break;
        }
    }
    return isChordProgression;
}

var musicConductor = {
    performanceString : '',
    scaleRule : new RestrictToScaleRule(currentKey + '-' + scaleType),
    noteRecentlyPlayedInScale : false,
    maxMillisWithoutNoteInScale : 5000,
    lastTimeWhenNoteInScalePlayedInMillis : 0,
    chordsPlaying : [],
    lastChordsPlayed : new Set(),
    currentChordsPlaying : new Set(),
    chordProgressionType : 'Major',
    chordProgressionsPlayedCount : 0,
    maxMillisNoChordProgCountReset : 5000,
    lastTimeWhenChordProgPlayedInMillis : 0,
    replayedSameChordInProgressionMap : false,
    repeatChordsDontImpactProgressionsPlayedCount : true
};
/**
 * @returns string of musical performance: 
 * i.e. note letter, instrumental note position, scaleDegree, chords playing  
 */
function setMusicalPerformanceString() {
    if(musicConductor.chordsPlaying.length > 0) {
        musicConductor.lastChordsPlayed.clear();
        musicConductor.chordsPlaying.forEach(chordName => musicConductor.lastChordsPlayed.add(new ChordInstance(chordName)));
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
        if(!musicConductor.noteRecentlyPlayedInScale) {
            musicConductor.noteRecentlyPlayedInScale = musicConductor.scaleRule.isInScaleAscOrDesc(noteObject_i.letter);
            if(musicConductor.noteRecentlyPlayedInScale) {
                musicConductor.lastTimeWhenNoteInScalePlayedInMillis = Date.now();
            }
        } 
    }
    if(musicConductor.lastTimeWhenNoteInScalePlayedInMillis != undefined && (Date.now() - musicConductor.lastTimeWhenNoteInScalePlayedInMillis >= musicConductor.maxMillisWithoutNoteInScale)) {
        musicConductor.noteRecentlyPlayedInScale = false;
    }
    if(musicConductor.noteRecentlyPlayedInScale) {
        musicConductor.performanceString += 'Note was recently played in scale\n';
    }
    var liveAudioInputEnabled = liveAudioInputEnabled || false;
    if(!liveAudioInputEnabled) {
        var chordsPlaying = [];
        musicConductor.currentChordsPlaying.clear();
        for(chordName of chordLetterSetByChordName.keys()) {
            var oneChordLetterSet = chordLetterSetByChordName.get(chordName);
            //letters playing.size can be greater than oneChordLetterSet.size to allow for chord doubling, i.e. multiples of the same note.
            if(oneChordLetterSet.size <= lettersPlaying.size) {
                var isMatch = true;
                for (letter of lettersPlaying) {
                    if (!oneChordLetterSet.has(letter)) {
                        isMatch = false;
                    }
                }
                if(isMatch) {
                    chordsPlaying.push(chordName);
                    musicConductor.currentChordsPlaying.add(new ChordInstance(chordName));
                }
            }
        }
        musicConductor.chordsPlaying = chordsPlaying;
        if(lettersPlaying.size >0 ) {
            musicConductor.performanceString += 'Chords Playing: '+ chordsPlaying.join(', ') +'\n';
            if(musicConductor.chordsPlaying.length > 0) {
                if(isChordProgression()) {
                    ++musicConductor.chordProgressionsPlayedCount;
                    musicConductor.lastTimeWhenChordProgPlayedInMillis = Date.now();
                }
                if(musicConductor.replayedSameChordInProgressionMap && musicConductor.repeatChordsDontImpactProgressionsPlayedCount) {
                    musicConductor.lastTimeWhenChordProgPlayedInMillis = Date.now();
                }
            }
        }
        if(musicConductor.lastTimeWhenChordProgPlayedInMillis != undefined && (Date.now() - musicConductor.lastTimeWhenChordProgPlayedInMillis >= musicConductor.maxMillisNoChordProgCountReset)) {
            musicConductor.chordProgressionsPlayedCount = 0;
        }
        musicConductor.performanceString += 'Chord Progressions played: '+musicConductor.chordProgressionsPlayedCount+'\n';
    }
}

//Ideally set the delay to 100 ms to ensure precision, but leaving delay up to caller.
var musicPerformanceTimerVar;
function switchOnOffMusicalPerformance(delay) {
    if(!musicPerformanceTimerVar) {
        musicPerformanceTimerVar = setInterval(setMusicalPerformanceString, delay);
    } else {
        clearInterval(musicPerformanceTimerVar);
    }
}