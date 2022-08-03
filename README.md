# ![wmc-logo](webMidiConductor/favicon.ico) webmidi-conductor
JavaScript library for interpreting midi messages and audits live performance. Determines if notes being played are in the desired scale along with indicating each note's scale degree. It also indicates what chords are being played and if the a good chord progression has occurred. 

It comes with a free demo wallball pong-esque game. [Click Here to Play!](https://www.pauljuneauengineer.com/webmidi-conductor/)

[wallball game demo intro blog post](https://www.pauljuneauengineer.com/blog/webmidi-conductor/wmc-wallball-intro.html)

[webmidi-conductor blog home page](https://www.pauljuneauengineer.com/blog/webmidi-conductor/home.html)

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
   * Prints note name played, scale degree ascending/descending, and chord being played (chord detection not enabled for live audio).
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

