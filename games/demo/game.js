/** 
    Copyright © 2021 Paul Juneau All Rights Reserved.
**/

function resize() {
    var canvas = document.getElementById('game');
    var canvasRatio = canvas.height / canvas.width;
    var windowRatio = window.innerHeight / window.innerWidth;
    var width;
    var height;

    if (windowRatio < canvasRatio) {
        height = window.innerHeight;
        width = height / canvasRatio;
    } else {
        width = window.innerWidth;
        height = width * canvasRatio;
    }

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
};

window.addEventListener('resize', resize, false);

///////////////////////
// GAME SETUP DIALOG //
///////////////////////
var gameSetupDialog = document.getElementById('gameSetupDialog');

function showGameSetupModal() {
    gamePaused = true;
    document.getElementById("welcomeScreen").style.display="none";
    document.getElementById("game").style.display="inline";
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        document.getElementById("performanceStringFontSize").defaultValue = "18";
    }
    gameSetupForm["keys"].value = gameSetupPreferences.key;
    if (typeof gameSetupDialog.showModal === "function") {
        gameSetupDialog.showModal();
    } else {
        alert("The <dialog> API is not supported by this browser");
    }
    return;
}

/**
 * @description "Confirm" button of form triggers "close" on dialog because of [method="dialog"]
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
 */
gameSetupDialog.addEventListener('close', function onClose() {
    var gameSetupForm = document.forms["gameSetupForm"];
    gameSetupPreferences.key = gameSetupForm["keys"].value;
    gameSetupPreferences.scaleType = gameSetupForm["scales"].value;
    changeKeyAndScale(gameSetupPreferences.key,gameSetupPreferences.scaleType);
    gameSetupPreferences.shrinkPaddleWhenOutOfScale = gameSetupForm["shrinkPaddleWhenOutOfScale"].checked;
    gameSetupPreferences.changeKeyOnLowestKey = gameSetupForm["changeKeyOnLowestKey"].checked;
    gameSetupPreferences.changeToHighestKeyAfterLowestPlayed = gameSetupForm["changeToHighestKeyAfterLowestPlayed"].checked;
    gameSetupPreferences.performanceStringFontSize = gameSetupForm["performanceStringFontSize"].value;
    gameSetupPreferences.performanceStringFont = gameSetupPreferences.performanceStringFontSize+'px '+gameSetupPreferences.performanceStringFontType;
    paddlePerfomanceFont.setFont(gameSetupPreferences.performanceStringFont);
    gameSetupPreferences.wallLifeSpan = gameSetupForm["wallLifeSpan"].value;
    wallLifeDrain = 1/Number(gameSetupPreferences.wallLifeSpan);
    gameSetupPreferences.cannonBallBounceOffWalls = gameSetupForm["cannonBallBounceOffWalls"].checked;
    gameSetupPreferences.cannonFireOnNewChord = gameSetupForm["cannonFireOnNewChord"].checked;
    setTimeout(() => {
        gamePaused = false;
    }, 3000);
});

function enablePitchDetect() {
    try {
        //if user confirms, then liveAudioInputEnabled is set to true in pitchdetect.js
        enableLiveAudioInput('Live audio is unable to be used on your device. Please use midi device or computer keyboard instead.');
    } catch(err) {
        console.log(err);
    }
    return;
}

////////////////////
// GAME CHALLENGE //
////////////////////
/** 
 * BEGIN PONG
 */
/**
 * @description color wheel spoke correlates to coresponding major key in circle of fifths.
 * @see https://www.w3schools.com/colors/colors_wheels.asp
 */
let paddleColorByKeyMap = new Map();
//Acceptable note letters: C, C#, D, D#, E, F, F#, G, G#, A, A#, B"
function loadPaddleColorMap() {
    for(key of ACCEPTABLE_NOTE_NAMES_ARRAY) {
        switch (key) {
            case 'C': //12
                paddleColorByKeyMap.set(key, [255,0,0,1]);//RED
                break; 
            case 'G': //1 
                paddleColorByKeyMap.set(key, [255,128,0,1]);//ORANGE
                break; 
            case 'D': //2
                paddleColorByKeyMap.set(key, [255,255,0,1]);//YELLOW
                break; 
            case 'A': //3 
                paddleColorByKeyMap.set(key, [128,255,0,1]);//Chartreuse
                break; 
            case 'E': //4
                paddleColorByKeyMap.set(key, [0,255,0,1]);//GREEN
                break;     
            case 'B': //5
                paddleColorByKeyMap.set(key, [0,255,128,1]);//SPRING GREEN
                break;
            case 'F#': //6
                paddleColorByKeyMap.set(key, [0,255,255,1]);//CYAN
                break;
            case 'C#': //7 
                paddleColorByKeyMap.set(key, [0,128,255,1]);//DODGER BLUE
                break;  
            case 'G#': //8 Ab on Circle of fifths 
                paddleColorByKeyMap.set(key, [0,0,255,1]);//BLUE
                break;  
            case 'D#': //9 Eb on Circle of fifths
                paddleColorByKeyMap.set(key, [128,0,255,1]);//ELECTRIC INDIGO
                break;  
            case 'A#': //10 Bb on Circle of fifths
                paddleColorByKeyMap.set(key, [255,0,255,1]);//MAGENTA
                break;  
            case 'F': //11
                paddleColorByKeyMap.set(key, [255,0,128,1]);//DEEP PINK
                break;  
            default:
                paddleColorByKeyMap.set(key, [255,0,0,1]);//RED
        }
    }
}
loadPaddleColorMap();
//currentKey should be defined in musicConductorCtrl.js which should run before game.js
var currentAlphaValue = paddleColorByKeyMap.get(currentKey)[3];
var wallLifeDrain;

var gameSetupPreferences = {
    key : 'C',
    scaleType : 'major',
    performanceStringFontSize: 10,
    performanceStringFontType: 'monospace',
    performanceStringFont : '10px monospace',
    wallLifeSpan : 10,
    cannonBallBounceOffWalls : false,
    cannonFireOnNewChord : false,
    shrinkPaddleWhenOutOfScale : false,
    changeKeyOnLowestKey : false,
    changeToHighestKeyAfterLowestPlayed : false,
    lowestMidiNumber : 21, //A0
    highestMidiNumber : 108 //C8
};

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 15;
const paddleHeight = grid * 5; // 80
const maxPaddleY = canvas.height - grid - paddleHeight;

var paddleSpeed = 6;
var ballSpeed = 5;

const leftPaddle = {
    // start in the middle of the game on the left side
    x: grid * 2,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,

    // paddle velocity
    dy: 0
};
const rightPaddle = {
    // start in the middle of the game on the right side
    x: canvas.width - grid * 3,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,
    // paddle velocity
    dy: 0,
    cannonReloadTime: 0
};
const chordColorCannon = {
    speed: ballSpeed,
    cannonBalls: []
}

function ChordColorCannonShell(x,y,width,height,dx,dy) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dx = dx;
    this.dy = dy;
}

const ball = {
    // start in the middle of the game
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: grid,
    height: grid,

    // keep track of when need to reset the ball position
    resetting: false,

    // ball velocity (start going to the top-right corner)
    dx: ballSpeed,
    dy: -ballSpeed
};
var collisionFail = false;
// check for collision between two objects using axis-aligned bounding box (AABB)
// @see https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
function collides(obj1, obj2) {
    let collisionDetected = false;
    let obj2_rightEdgePenetrated =  obj1.x < obj2.x + obj2.width;
    let obj2_leftEdgePenetrated = obj1.x + obj1.width > obj2.x;
    
    if(obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y) 
    {
        collisionDetected = true;
    }
    else {
        //if ball left edge is to the left of left paddel's right edge
        if(collisionFail === false && obj2_rightEdgePenetrated) {
            collisionFail = true;
        }
    }
    return collisionDetected;
}

//TODO idea: 1P vs 2P wallball vs middle-c split via game setup modal
var isWallBall = true;
const wallBallDimensions = {
    y : grid*3,
    height : canvas.height - grid*7,
    width : grid,
    leftWall_x : grid * 2,
    rightWall_x :  canvas.width - grid * 3
};

// give some time for the player to recover before launching the ball again
function resetBall(resetWall) {
    // give some time for the player to recover before launching the ball again
    setTimeout(() => {
        ball.resetting = false;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        if(resetWall) {
            leftPaddle.x = wallBallDimensions.leftWall_x;
            leftPaddle.y = wallBallDimensions.y;
            leftPaddle.height = wallBallDimensions.height;
            leftPaddle.width = wallBallDimensions.width;
            currentAlphaValue = 1;
        } 
    }, 400);
}

var paddlePerfomanceFont = {
    width   : "10px",
    height  : "monospace",
    setFont : function(fontString) {
        var fontComponents = fontString.split(" ");
        this.width  = fontComponents[0];
        this.height = fontComponents[1];
        rightPaddlePerfomance.width  = this.width;
        rightPaddlePerfomance.height = this.height;
    }
}

function CanvasObject(width, height, color, x, y, type, lineHeight) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;   
    this.lineHeight = lineHeight; 
    this.update = function() {
        ctx = context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.multiLineTextUpdate = function() {
        var multiLineText = this.text.split('\n');
        for (var i = 0; i<multiLineText.length; i++) {
            context.font = this.width + " " + this.height;
            context.fillStyle = this.color;
            context.fillText(multiLineText[i], this.x, this.y + (i*this.lineHeight) );
        }
    }
}
const midLine = canvas.width / 2 - grid / 2;
var leftPaddleScore = new CanvasObject("30px", "Consolas", "white", midLine-100, 40, "text");
var rightPaddleScore = new CanvasObject("30px", "Consolas", "white", midLine+100, 40, "text");
leftPaddleScore.text = 0;
rightPaddleScore.text = 0;
var rightPaddlePerfomance = new CanvasObject(paddlePerfomanceFont.width, paddlePerfomanceFont.height, "white", wallBallDimensions.leftWall_x+100, 70, "text", 15);
rightPaddlePerfomance.text = '';

//TODO idea: add clearInterval(musicPerformanceTimerVar) to start stop timmer accordingly 
//start timer to measure music performance very 100 milliseconds (1/10th second)
var musicPerformanceTimerVar = setInterval(setMusicalPerformanceString ,100);

var oldChordLetterSetByChordNameEntry;
var cannonReloadTimeStartTime, cannonReloadTimeElapsed;
var oldRightPaddleColorKey;
// game loop
function loop() {    
    //requestAnimationFrame(loop);
    requestAnimationFrame(loop);
    context.clearRect(0,0,canvas.width,canvas.height);

    if(isWallBall) {
        leftPaddle.y = wallBallDimensions.y;
        leftPaddle.height = wallBallDimensions.height;
    }

    if (rightPaddle.cannonReloadTime > 0) {
        rightPaddle.cannonReloadTime--;
        cannonReloadTimeElapsed = performance.now() - cannonReloadTimeStartTime;
        //console.log('cannonReloadTime: '+cannonReloadTimeElapsed);
    }

    // move paddles by their velocity
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;

    // prevent paddles from going through walls
    //prevent from going through top of grid
    if (leftPaddle.y < grid) {
        leftPaddle.y = grid;
    }//prevent from going through bottom of grid
    else if (leftPaddle.y > maxPaddleY) {
        leftPaddle.y = maxPaddleY;
    }
    //prevent from going through top of grid
    if (rightPaddle.y < grid) {
        rightPaddle.y = grid;
    }//prevent from going through bottom of grid
    else if (rightPaddle.y > maxPaddleY) {
        rightPaddle.y = maxPaddleY;
    }

    // draw paddles
    let leftPaddleColorKey = currentKey;
    // convert to relative major from minor
    if(scaleType != undefined && scaleType.search("minor") != -1) {
        leftPaddleColorKey = convertKeyToRelativeMajorFromMinor();
    }
    var red = paddleColorByKeyMap.get(leftPaddleColorKey)[0];
    var green = paddleColorByKeyMap.get(leftPaddleColorKey)[1];
    var blue = paddleColorByKeyMap.get(leftPaddleColorKey)[2];
    var alpha = currentAlphaValue;
    if(alpha > 0 ) { 
        context.fillStyle = "rgba("+red+","+green+","+blue+","+alpha+")";
        context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    } else {
        leftPaddle.height = leftPaddle.y; 
        leftPaddle.width = 0;
        leftPaddle.x = 0;
    }
    var rightPaddleColorKey;
    if(musicConductor.chordsPlaying.length  > 0) {
        var chordName = musicConductor.chordsPlaying[0];
        rightPaddleColorKey = chordName.split(' ')[0];
        red = paddleColorByKeyMap.get(rightPaddleColorKey)[0];
        green = paddleColorByKeyMap.get(rightPaddleColorKey)[1];
        blue = paddleColorByKeyMap.get(rightPaddleColorKey)[2];
        alpha = 1;
        var chordColor = "rgba("+red+","+green+","+blue+","+alpha+")";
        context.fillStyle = chordColor;
        context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

        oneChordLetterSetByChordNameEntry = chordLetterSetByChordName.get(chordName);
        var differentChordPlayed = false;
        if(oldChordLetterSetByChordNameEntry != oneChordLetterSetByChordNameEntry) {
            //TODO allow chord scoring to be turned on/off
            // rightPaddleScore.text += oneChordLetterSetByChordNameEntry.size;
            oldChordLetterSetByChordNameEntry = oneChordLetterSetByChordNameEntry;
            differentChordPlayed = true;
        }
        var cannonReadyToLoad = true;
        if(gameSetupPreferences.cannonFireOnNewChord == true) {
            if(differentChordPlayed) 
                cannonReadyToLoad = true;
            else
                cannonReadyToLoad = false;
        }
        cannonReadyToLoad = rightPaddle.cannonReloadTime === 0 && cannonReadyToLoad;
        if(cannonReadyToLoad) {
            // load cannon ball to shoot
            var cannonBall_straightShot = new ChordColorCannonShell(rightPaddle.x - rightPaddle.width, rightPaddle.y + (paddleHeight/2), ball.width/2, ball.height/2, -chordColorCannon.speed,0);
            var chordLetterCounter = 1;
            var completedPhase = false;
            for(let oneLetterInChord of oneChordLetterSetByChordNameEntry) {
                switch (chordLetterCounter) {
                    case 1:
                        if(completedPhase) {
                            var cannonBall_straightShot2 = new ChordColorCannonShell(
                                cannonBall_straightShot.x+1.5*rightPaddle.width,
                                cannonBall_straightShot.y,
                                cannonBall_straightShot.width,
                                cannonBall_straightShot.height,
                                cannonBall_straightShot.dx,
                                0
                            );
                            chordColorCannon.cannonBalls.push(cannonBall_straightShot2);
                        } else {
                            chordColorCannon.cannonBalls.push(cannonBall_straightShot);
                        }    
                        break;
                    case 2:
                        var cannonBall_downLeft = new ChordColorCannonShell(
                            cannonBall_straightShot.x,
                            cannonBall_straightShot.y,
                            cannonBall_straightShot.width,
                            cannonBall_straightShot.height,
                            cannonBall_straightShot.dx,
                            chordColorCannon.speed
                        );
                        chordColorCannon.cannonBalls.push(cannonBall_downLeft);
                        break;
                    case 3:
                        var cannonBall_upRight = new ChordColorCannonShell(
                            cannonBall_straightShot.x,
                            cannonBall_straightShot.y,
                            cannonBall_straightShot.width,
                            cannonBall_straightShot.height,
                            cannonBall_straightShot.dx,
                            -chordColorCannon.speed
                        );
                        chordColorCannon.cannonBalls.push(cannonBall_upRight);
                        chordLetterCounter = 0;
                        completedPhase = !completedPhase;
                        break;
                    default:
                        break;
                }
                chordLetterCounter++;
            }
            // cannonReloadTime of 50 Approximates to 1000 milliseconds. 
            // 50 will last longer or shorter than 1000 milliseconds based on additional processing introduced or removed.
            // debug cannonReloadTimeElapsed to find desired cannonReloadTime.
            //TODO make cannonReloadTime a config setting
            rightPaddle.cannonReloadTime = 50; 
            cannonReloadTimeStartTime = performance.now();
        }
    } else {
        context.fillStyle = 'white';
        context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    }
    if(oldRightPaddleColorKey != rightPaddleColorKey && rightPaddleColorKey != undefined)
        oldRightPaddleColorKey = rightPaddleColorKey;

    // draw cannon balls
    if(oldRightPaddleColorKey != undefined) {
        context.fillStyle = "rgba("+
            paddleColorByKeyMap.get(oldRightPaddleColorKey)[0]+","+
            paddleColorByKeyMap.get(oldRightPaddleColorKey)[1]+","+
            paddleColorByKeyMap.get(oldRightPaddleColorKey)[2]+","+
            "1)";
        chordColorCannon.cannonBalls.forEach(function(cannonBall, index) {
            context.fillRect(cannonBall.x, cannonBall.y, cannonBall.width, cannonBall.height);

            // remove cannon ball if it hits the wall
            if (collides(cannonBall, leftPaddle)) {
                chordColorCannon.cannonBalls.splice(index, 1);
                chordColorCannon.cannonBalls.length = 0;
                currentAlphaValue -= wallLifeDrain;
                rightPaddleScore.text += 1;
            }
            // remove cannon ball if it hits the ball then reset ball
            else if (collides(cannonBall, ball)) {
                chordColorCannon.cannonBalls.splice(index, 1);
                chordColorCannon.cannonBalls.length = 0;
                resetBall(false);
            }
                
            // move cannon balls
            cannonBall.x += cannonBall.dx;
            cannonBall.y += cannonBall.dy;

            // remove cannon balls that leave the screen
            if (cannonBall.x < 0 || cannonBall.x > canvas.width) {
                chordColorCannon.cannonBalls.splice(index, 1);
            }
            if(gameSetupPreferences.cannonBallBounceOffWalls) {
                if(cannonBall.y < grid) {
                    cannonBall.y = grid;
                    cannonBall.dy *= -1;
                } else if (cannonBall.y + grid > canvas.height - grid) {
                    cannonBall.y = canvas.height - grid * 2;
                    cannonBall.dy *= -1;
                }
            } else {
                if(cannonBall.y < grid || cannonBall.y + grid > canvas.height - grid){
                    chordColorCannon.cannonBalls.splice(index, 1); 
                }
            } 
        });
    }

    //put back to white for ball to fill white
    context.fillStyle = 'white';

    // move ball by its velocity
    if(!gamePaused) {
        if(!midiChlorianCtrlr.isDamperOn) {
            ball.x += ball.dx;
            ball.y += ball.dy;
        } else {
           let halfSpeedX = ball.dx/2;
           let halfSpeedY = ball.dy/2;
           ball.x += halfSpeedX;
           ball.y += halfSpeedY;
        }
    }

    // prevent ball from going through walls by changing its velocity
    //prevent from going through top of grid
    if (ball.y < grid) {
        ball.y = grid;
        ball.dy *= -1;
    }//prevent from going through bottom of grid
    else if (ball.y + grid > canvas.height - grid) {
        ball.y = canvas.height - grid * 2;
        ball.dy *= -1;
    }

    // reset ball if it goes past paddle (but only if we haven't already done so)
    if ( (ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
        ball.resetting = true;
        if(ball.x > canvas.width) {
            leftPaddleScore.text += 10;
        }
        if(ball.x < 0 ) {
            rightPaddleScore.text += 10;
            gameOver();
        }
        resetBall(false);
    }

    // check to see if ball collides with paddle. if they do change x velocity
    if (collides(ball, leftPaddle)) {
        ball.dx *= -1;

        // move ball next to the paddle otherwise the collision will happen again
        // in the next frame
        ball.x = leftPaddle.x + leftPaddle.width;
        currentAlphaValue -= wallLifeDrain;
    }
    else if (collides(ball, rightPaddle)) {
        ball.dx *= -1;

        // move ball next to the paddle otherwise the collision will happen again
        // in the next frame
        ball.x = rightPaddle.x - ball.width;
    }

    // draw ball
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    // draw walls
    context.fillStyle = 'lightgrey';
    context.fillRect(0, 0, canvas.width, grid);
    context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

    // draw dotted line down the middle
    for (let i = grid; i < canvas.height - grid; i += grid * 2) {
        context.fillRect(midLine, i, grid, grid);
    }

    leftPaddleScore.update();
    rightPaddleScore.update();
    rightPaddlePerfomance.text = musicConductor.performanceString;
    rightPaddlePerfomance.multiLineTextUpdate();
}

////////////////////////////////////////////////////////////////////////////////////////
//                                   PLAYER PADDLES                                   //
////////////////////////////////////////////////////////////////////////////////////////
var lowestMidiNotePlayed = midiChlorianCtrlr.highestMidiNoteNumber;
/** 
 * @description listens to midi-chlorian controller event 
 * - moves player's paddle up or down if the player went up or down the register. 
 * - shrinks player paddle in half if shrink-when-out-of-scale rule turned on
 * @listens MidiInstrumentationEvents.MIDICHLORIANCTRLEVENT - published from
 *  midiChlorianController.js' MidiInstrumentationEvents.NOTEBEINGPLAYED event listener.
 * @param e.value - stringified midiChlorianCtrlr 
 * @returns void
 */
document.addEventListener(MidiInstrumentationEvents.MIDICHLORIANCTRLEVENT, function(e) {
    const oneMidiChlorianCtrlrEvent = JSON.parse(e.value);
    if (oneMidiChlorianCtrlrEvent.countIncreased ) {
        rightPaddle.dy = -paddleSpeed;
    } else if ( oneMidiChlorianCtrlrEvent.countDecreased ) {
        rightPaddle.dy = paddleSpeed;
    } else {
        rightPaddle.dy = 0;
    }

    if(gameSetupPreferences.shrinkPaddleWhenOutOfScale && !musicConductor.scaleRule.evaluateRule(oneMidiChlorianCtrlrEvent)) {
        var tempHeight = rightPaddle.height/2;
        rightPaddle.height = tempHeight;
    }
    setTimeout(function(){
        rightPaddle.dy = 0; 
        rightPaddle.height = paddleHeight;
        }, 
        //hardcoding beat duration for .25 second for now... assuming 4 4 time
        //TODO idea: use beat duration instead to cause affect on object to persist while note was held down
        250
    );
    
    var midiNumberPlaying = parseInt(oneMidiChlorianCtrlrEvent.midiInputPlaying.note);
    if(gameSetupPreferences.changeKeyOnLowestKey && midiNumberPlaying < lowestMidiNotePlayed) {
        lowestMidiNotePlayed = midiNumberPlaying;
        var key = getNoteNameFromNumber(midiNumberPlaying, true);
        gameSetupPreferences.key = key;
        changeKeyAndScale(key,gameSetupPreferences.scaleType);
    }
    if(gameSetupPreferences.changeToHighestKeyAfterLowestPlayed && 
        midiNumberPlaying == gameSetupPreferences.highestMidiNumber && 
        lowestMidiNotePlayed == gameSetupPreferences.lowestMidiNumber)
    {
        lowestMidiNotePlayed = midiNumberPlaying;
        var key = getNoteNameFromNumber(midiNumberPlaying, true);
        gameSetupPreferences.key = key;
        changeKeyAndScale(key,gameSetupPreferences.scaleType);
    }
});
/* END player paddle controls*/

// start the game
requestAnimationFrame(loop);

function gameOver() {
    gamePaused = true;
    
    var confirmRedirect = confirm(
        "Congrats on breaking through the wall!\n"+
        "May you breakdown all the walls that impede you! \n" +
        "Click okay to see more details about this game and maybe some other cool things I'm working on.\n" +
        "Click cancel to setup another game."
    );
    if(confirmRedirect) {
        document.getElementById('redirectToBuyMeCoffee').click();
    } else {
        resetBall(true);
        setTimeout(() => {
            showGameSetupModal();
        }, 1000);
        
    }
}
/** 
 * END PONG
 */
console.log('finished loading game..');