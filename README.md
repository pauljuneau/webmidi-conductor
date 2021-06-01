# webmidi-conductor
JavaScript library for interpreting midi messages and audits live performance. Determines if notes being played are in the desired scale along with indicating each note's scale degree. It also indicates what chords are being played.

It comes with a free demo wall ball pong-esque game.

[Click Here to Play!](https://www.pauljuneauengineer.com/webmidi-conductor/)

# Wall Ball Game Demo Overview

## Setup 

* Plug in your midi instrument (e.g. piano) to your computer or smartphone prior to accessing the game demo site via link above.  

## Rules

* Playing up or down in pitch causes paddle to move up or down.
* Paddle will shrink if not playing within the designated scale.
* Goals are 10 points 
* Triad chords are 3 points & 7ths are 4.
* Wall color is based on the defined key's position on a RGB Circle of 5ths Color Wheel.
   * In the major key: C is red, E is green, and G# (Ab) is blue.
* When chord is played, paddle will change color to related chord's key mapped to RGB Circle of 5ths Color where C chords are red, E chords are green, and G# (Ab) chords are blue.

<!-- TODO imbed image of Wall color assignment based on circle of fifths -->

## Development Features

* Cross platform compatible (Android, PC, Mac, iPhone).
   * iOS devices have not been tested yet. Please feel free to submit an issue to let me know if it does not work.
* Resizes to fit mobile screen.
* Compatible with any midi instrument and browser that works with the https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess.
* Can choose to enable Live audio to interpret sound as pitch events increasing or decreasing to move paddle up or down.
* Real-time scale detection based on desired scale.
   * Prints note name played, scale degree ascending/descending, and chord being played.
   * Compatible Scales:
      *  major, natural minor, melodic minor, harmonic minor
   * Compatible Chords:
      * Triads: Major, Minor, Augmented, Diminished
      * 7ths: Major, Minor, Dominant, Minor 7th flat 5, Diminished, Minor-major 
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

# Contact

* Leave a post or reply on [GitHub Discussions](https://github.com/pauljuneau/webmidi-conductor/discussions) to let me know what you think about this project!

