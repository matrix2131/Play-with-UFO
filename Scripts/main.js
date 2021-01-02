const canvas = document.getElementById("ufocanvas");

// ctx.fillStyle = 'green';
// ctx.fillRect(0,0,150,75);    // (0,0) to (150,75)

// ctx.font = '38px Arial';
// ctx.fillStyle = 'red';
// ctx.fillText("UFO",30,130);   // (30,130) is the position of text in the canvas.
// ctx.strokeText("Hunter",120,130);

// udemy_image = new Image();
// udemy_image.src = 'Images/udemy.png';

// udemy_image.onload = function(){
//     return ctx.drawImage(udemy_image,80,20);
// };

canvas.width = 900;
canvas.height = 750;
const ctx = canvas.getContext('2d');

// Canvas automatic resizing
function resize()
{
    const height = window.innerHeight - 20;
    const ratio = canvas.width / canvas.height;
    const width = height * ratio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
}

window.addEventListener('load',resize,false);

// Game Basics
function GameBasics(canvas){
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;

// active playing field
this.playBoundaries = {
    top : 150,   //150 pixel away from the top of the canvas
    bottom:650,   // 650 px away from the top of the canvas
    left: 100,   // 100 px away from left of the canvas
    right: 800   // 800px away from left part of canvas
};


//initial values
this.level = 1;
this.score = 0;
this.shields = 2;

this.setting = {
    //game settings
    //FPS: 60 frame per second, this means 1 new frame in every 0.016666667 sec.
    updateSeconds :(1/60),
    spaceshipSpeed : 300,
    bulletSpeed : 300,
    bulletMaxFrequency: 300,  // how fast the spaceship can shoot on eafter the another.

    ufoLines: 4, //number of UFO lines	
    ufoColumns: 8, //number of UFO columns		 
    ufoSpeed: 35, //speed of UFO 
    ufoSinkingValue: 30, //that's how much the UFO sinks, value of sinking


    bombSpeed: 100, //bomb falling speed
    bombFrequency: 0.05, //bomb dropping frequency

    pointsPerUFO: 25, //points per UFO value 

};

// we collect here the different positions, states of the game.
this.positionContainer =[];      // this is a stack.

// presses keys storing
this.pressedKeys = {};

}

// Return to current game position, status. Always returns the top element of positionContainer.
GameBasics.prototype.presentPosition = function()
{
    return this.positionContainer.length > 0 ? this.positionContainer[this.positionContainer.length - 1] : null;
};

GameBasics.prototype.goToPosition = function(position){
    // If we are already in a position clear the positionContainer.
    if(this.presentPosition())
    {
        this.positionContainer.length = 0;
    }

    // If we find an 'entry' in a given position, we call it.
    if(position.entry)
    {
        position.entry(play);
    }

    // Setting the current game position in the positionContainer
    this.positionContainer.push(position);
};

//Push our new position into the positionContainer
GameBasics.prototype.pushPosition = function(position)
{
    this.positionContainer.push(position);
};

// Pop the position from the positionContainer.
GameBasics.prototype.popPosition = function()
{
    this.positionContainer.pop();
};

GameBasics.prototype.start = function()
{
    setInterval(function() {gameLoop(play);}, this.setting.updateSeconds * 1000);  // every 1000 ms , this function will be called.
    // Go into the Opening Position.
    this.goToPosition(new OpeningPosition());
};



// Notifies the game when a key is pressed
GameBasics.prototype.keyDown = function (keyboardCode) {
    // store the pressed key in 'pressedKeys'
    this.pressedKeys[keyboardCode] = true;
    //console.log(this.pressedKeys);
    //  it calls the present position's keyDown function
    if (this.presentPosition() && this.presentPosition().keyDown) {
      this.presentPosition().keyDown(this, keyboardCode);
    }
  };

  //  Notifies the game when a key is released
GameBasics.prototype.keyUp = function (keyboardCode) {
    // delete the released key from 'pressedKeys'
    delete this.pressedKeys[keyboardCode];
  };
  

function gameLoop(play)
{
    let presentPosition = play.presentPosition();

    if(presentPosition){
        // update
        if(presentPosition.update){
            presentPosition.update(play);
        }
        // draw
        if(presentPosition.draw) {
            presentPosition.draw(play);
        }

    }
}

// Keyboard events listening
window.addEventListener("keydown", function (e) {
    const keyboardCode = e.which || event.keyCode; // Use either which or keyCode, depending on browser support
    if (keyboardCode == 37 || keyboardCode == 39 || keyboardCode == 32) { e.preventDefault(); } //space/left/right (32/37/29)
    play.keyDown(keyboardCode);
  });
  
  window.addEventListener("keyup", function (e) {
    const keyboardCode = e.which || event.keyCode; // Use either which or keyCode, depending on browser support
    play.keyUp(keyboardCode);
  });

const play = new GameBasics(canvas);
play.sounds = new Sounds();
play.sounds.init();
play.start();