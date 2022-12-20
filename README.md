# ![wmc-logo](webMidiConductor/favicon.ico) webmidi-conductor
JavaScript library for interpreting midi messages and audits live performance. Determines if notes being played are in the desired scale along with indicating each note's scale degree. It also indicates what chords are being played and if a good chord progression has occurred. 

It comes with a free demo wallball pong-esque game. [Click Here to Play!](https://www.pauljuneauengineer.com/webmidi-conductor/)

[wallball game demo intro blog post](https://www.pauljuneauengineer.com/blog/webmidi-conductor/wmc-wallball-intro.html)

[webmidi-conductor blog home page](https://www.pauljuneauengineer.com/blog/webmidi-conductor/home.html)

### Other applications of webmidi-conductor
* https://github.com/pauljuneau/wmc-game-phaser-poc
* https://github.com/pauljuneau/wmc-game-frequency-flier
# Development Features
## wallball game demo features
* Cross platform compatible (Android, PC, Mac).
   * iPhones are unable to use the live audio feature. Please connect a midi device or a computer keyboard instead. 
      * midi input devices such as a digital piano have yet to tested on iPhones. Please submit an issue if there is a midi input device compatibility problem and please provide details about the phone's iOS and model. Thank you!  
* Resizes to fit mobile screen.
* Can choose to enable Live audio to interpret sound as pitch events increasing or decreasing to move paddle up or down.
   * Consumes pitch JavaScript events produced by [PitchDetectMirror](https://github.com/pauljuneau/PitchDetectMirror).
## webmidi-conductor JavaScript repo features
* Compatible with any midi instrument and browser that works with the https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess.
* Real-time scale detection based on desired scale.
   * Can print note name played, scale degree ascending/descending, and chord being played (chord detection not enabled for live audio).
   * Compatible Scales:
      *  major, natural minor, melodic minor, harmonic minor, minor pentatonic, major pentatonic, major blues, minor blues, major bepop, minor bepop, dorian mode, phrygian mode, lydian mode, mixolydian mode, aeolian mode, and locrian mode.
   * Compatible Chords:
      * Triads: Major, Minor, Augmented, Diminished
      * 7ths: Major, Minor, Dominant, Minor 7th flat 5, Diminished, Minor-major 
* Real-time chord progression detection based on common Major or Minor progressions. Custom progressions can be introduced programatically. 
* Can use computer keyboard as simple piano:
   
   Computer Keyboard Key | Note Name | Midi Number
   ------------ | ------------- | -------------
   A | C (middle C) | 60
   W | C#/Db | 61
   S | D | 62
   E | D#/Eb | 63
   D | E | 64
   F | F | 65
   T | F#/Gb | 66
   G | G | 67
   Y | G#/Ab | 68
   H | A | 69
   U | A#/Bb | 70
   J | B | 71
   K | C | 72
   O | C#/Db | 73
   L | D | 74
   P | D#/Eb | 75
   ; | E | 76
   ' | F | 77
   ] | F#/Gb | 78  
   Spacebar | Sustain Pedal | N/A 

   * In the game demo, piano sounds are emulated from the keyboard input via games/demo/sounds and played by initiating the `play()` function on the hidden html `audio` tags. See [this code example](#listening-for-midiinstrumentationevents) on how to play piano sounds when playing on the computer keyboard.

## GitHub jsDelivr CDN
webmidi-conductor, WMC, is available via jsDeliv GitHub. To get WMC at a specific release then these 2 tags can be added in the following order. See https://www.jsdelivr.com/?docs=gh for more ways to attain javascript code from github.
```
<script src="https://cdn.jsdelivr.net/gh/pauljuneau/webmidi-conductor@2.5.1/webMidiConductor/midiChlorianController.js"></script>
<script src="https://cdn.jsdelivr.net/gh/pauljuneau/webmidi-conductor@2.5.1/webMidiConductor/musicConductorCtrl.js"></script>
```

## Enabling the webmidi music conductor 
The webmidi music conductor can continously run in the background to identify notes being played, their relationship with respect to the context scale, and detections of chords playing along with identifying chord progressions.
```
switchOnOffMusicalPerformance(100);
```


## Important global objects
MidiInstrumentationEvents: events that can be dispatched by webmidi-conductor
* NOTEBEINGPLAYED
* NOTELASTPLAYED 
* MIDICHLORIANCTRLEVENT - critical event that wraps the standard web midi object into an instance of a midiChlorianCtrlr
* PITCHEVENT - dispatched when pitch detect is enabled after properly integrating with the [PitchDetectMirror](https://github.com/pauljuneau/PitchDetectMirror).
* CHORDINSCALEPLAYED - dispatched when a chord is played in the given scale according to the context chord progression type (Major, Minor, or Custom)
* MISC_EVENT - useful when wanting to fire and listen to miscellaneous events that may not be covered here.


MidiMessageWrapper: There are multiple midi message classes that either mock or wrap midi message input such as **OnMidiMessageWrapper**, **OnKeyEventMidiMessageMock**, **OnPitchEventMidiMessageDTO**.
* NOTE the OnPitchEventMidiMessageDTO will only get instantiated if the pitchDetect related repo has been properly integrated with. 


midiChlorianCtrlr: template object for MIDICHLORIANCTRLEVENT which can indicate if the player went up or down the register, if the damper pedal is on, and what was the current or last midi input. Below is a summary of the object. It is not exhaustive and has documentation for the critical attributes.
```
midiChlorianCtrlr : {
   countIncreased : Boolean, //player went up in the register
   countDecreased : Boolean, //player went down in the register,
   midiInputPlayedLast : <MidiMessageWrapper>,
   midiInputPlaying : <MidiMessageWrapper>,
   isDamperOn : Boolean //indicates if the damper pedal is on
}
```


musicConductor: Below is a summary of the music conductor. It is not exhaustive and has documentation for the critical attributes. 
```
musicConductor : {
   performanceString : String, //multi-line string containing note name, scale degree, chords playing, if note in scale was recently played, or if chord progressions were recently played
   scaleRule: <RestrictToScaleRule>, //instance of RestrictToScaleRule that can evaluate if the current notes played are in the context scale
   noteRecentlyPlayedInScale: Boolean, //true or false if a note was recently played in the context scale
   maxMillisWithoutNoteInScale: Integer, //max time that can pass before noteRecentlyPlayedInScale resets to false if no note was played during that time.
   chordsPlaying : [String], //array of chords currently playing
   lastChordsPlayed: Set<ChordInstance>, //captures last chords played
   currentChordsPlaying: Set<ChordInstance>, //captures current chords playing
   chordProgressionType: String, //Recognizes the following values: Major, Minor, Custom as defined in CHORD_PROGRESSION_TYPES constants
   chordProgressionsPlayedCount: Integer, //count of how many chord progressions have been played consecutively
   maxMillisNoChordProgCountReset: Integer, // max time that can pass before chordProgressionsPlayedCount resets to zero if no chord progressions were played during that time.
   repeatChordsDontImpactProgressionsPlayedCount: Boolean // if a repeat chord in the context chord progression map is played then chordProgressionsPlayedCount is not impacted 
}
```


## Important global functions available
Change to the desired key and scale using the following function. For example, 'C','major'
```
changeKeyAndScale(key, scale)
```

Create a session cach instance that can store, retrieve, and publish events based on updates to the local session storage.
```
let tempCache = new SessionCache();
``` 
Update the cache with an item. Events will be dispatched if the key is one of the following MidiInstrumentationEvents 
```
tempCache.set(MidiInstrumentationEvents.MISC_EVENT, 'this is a miscellaneous event');
```
Retrieve an item from the cache.
```
let noteLastPlayed = tempCache.get(MidiInstrumentationEvents.NOTELASTPLAYED);
```


## Listening for MidiInstrumentationEvents
MidiInstrumentationEvents are dispatched which can be listened for and subsequently actioned upon such as playing piano sounds when playing on your computer keyboard or moving your character in a game.

```
document.addEventListener(MidiInstrumentationEvents.MIDICHLORIANCTRLEVENT, function(e) {
   const oneMidiChlorianCtrlrEvent = JSON.parse(e.value);
   
   //Play Piano Sounds when playing on computer keyboard
   if(oneMidiChlorianCtrlrEvent.midiInputPlaying.eventType == 'KEYBOARD') {
      try {
         document.getElementById(oneMidiChlorianCtrlrEvent.midiInputPlaying.noteName).play();
      } catch (e) {
         console.error(e.name + ': '+e.message);
      }
   }
   
   //example code to perform an action after player has played up or down in the register
   if(oneMidiChlorianCtrlrEvent.countIncreased) {
      //do something when the player played up in the register
    } else if ( oneMidiChlorianCtrlrEvent.countDecreased ) {
      //do something when the player played down in the register
    } else {
      //do something when the player did not go up or down in the register
    }

   //See if note played related to event is in the context scale:
   var isNoteInScale = musicConductor.scaleRule.evaluateRule(oneMidiChlorianCtrlrEvent);
   if(isNoteInScale == false) {
      //give feedback to player
   }
}

```

Do the following to stop piano sounds being played when they are no longer being played on the computer keyboard
```
document.addEventListener(MidiInstrumentationEvents.NOTELASTPLAYED, function(e){
  const oneNoteLastPlayed = JSON.parse(e.value);
  if(oneNoteLastPlayed.eventType == 'KEYBOARD') {
    try {
      document.getElementById(oneNoteLastPlayed.noteName).pause();
    } catch (e) {
      console.error(e.name + ': '+e.message);
    }
  }
});
```


# Sponsorship:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/classicantique)


# Thanks

* Danté Harrell, MM
   * Music Consultant
   * NYC Based Teaching Artist
   * carpenterproductions2019@gmail.com
* @straker
   * [Basic Pong HTML Game](https://gist.github.com/straker/81b59eecf70da93af396f963596dfdc5)
* https://youtu.be/iamRkSsnIS0
   * Web MIDI API demo video at Node+JS Interactive seminar Dec 2019
* Piano sounds when playing via computer keyboard
   * [Pack: 88 piano keys, long reverb by TEDAgame](https://freesound.org/people/TEDAgame/packs/25405/)   

# Contact

* Leave a post or reply on [GitHub Discussions](https://github.com/pauljuneau/webmidi-conductor/discussions) to let me know what you think about this project!

