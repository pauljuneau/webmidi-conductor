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

<!-- TODO imbed image of Wall color assignment based on circle of fifths -->

## Development Features

* Cross platform compatible (Android, PC, Mac, iPhone)
   * iOS devices have not been tested yet. Please feel free to submit an issue to let me know if it does not work.
* Resizes to fit mobile screen
* Compatible with any midi instrument and browser that works with the https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess
* Can choose to enable Live audio to interpret sound as pitch events increasing or decreasing to move paddle up or down.
* Real-time scale detection based on desired scale
   * Prints: note name played, scale degree ascending/descending
   * Compatible Scales:
      *  major, natural minor, melodic minor, harmonic minor

# Sponsorship:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/classicantique)


