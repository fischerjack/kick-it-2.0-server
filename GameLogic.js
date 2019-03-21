class Map{
  constructor(canvasWidth, canvasHeight){
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.mapTerrain = [];
    this.mapTerrain.push({
      xCoordinate: 0,
      yCoordinate: 0,
      width: 10,
      height: canvasHeight
    });
    this.mapTerrain.push({
      xCoordinate: canvasWidth - 10,
      yCoordinate: 0,
      width: 50,
      height: canvasHeight
    });
    this.mapTerrain.push({
      xCoordinate: canvasWidth / 3,
      yCoordinate: canvasHeight - 60,
      width: canvasWidth / 3,
      height: 5
    });
    this.mapTerrain.push({
      xCoordinate: canvasWidth / 8,
      yCoordinate: canvasHeight - 120,
      width: canvasWidth / 8,
      height: 5
    });
    this.mapTerrain.push({
      xCoordinate: canvasWidth / 8 * 6,
      yCoordinate: canvasHeight - 120,
      width: canvasWidth / 8,
      height: 5
    });
  }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Player{


  /**
   * Represents a player.
   * @constructor
   * @param {number} startingXCoordinate - starting x coordinate of the player (top-left corner)
   * @param {number} startingYCoordinate - starting y coordinate of the player (top-left corner)
   * @param {number} up                  - keycode used for jumping (positive y-direction)
   * @param {number} left                - keycode used for moving left (negative x-direction)
   * @param {number} right               - keycode used for moving right (positive x-direction)
   */
  constructor(startingXCoordinate, startingYCoordinate, up, left, right, kick, spriteSrc){
    this.xCoordinate = startingXCoordinate;                   //The x coordinate of the player (top-left corner)
    this.yCoordinate = startingYCoordinate;                   //The y coordinate of the player (top-left corner)
    this.width = 40;
    this.height = 50;
    this.speed = 3;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.friction = 0.9;
    this.gravity = 0.25;
    this.jumping = false;
    this.grounded = false;
    this.collisionDirection = '';

    //playerDirection is either 0 or 50, which will move vertically between the two symmetric levels in the sprite sheet
    this.playerDirection = 50;

    this.up = up;
    this.left = left;
    this.right = right;
    this.kick = kick;
    // this.playerImage = new Image();
    // this.playerImage.src = spriteSrc;
    this.spriteSrc = spriteSrc;
    this.spriteArrays = [[0,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7]]; //[[Idle],[Punch],[Kick],[Block],[Jump],[Run],[Hurt]]
    this.currentSpriteArray = this.spriteArrays[0];
    this.frameIndex = 0;
    this.ticksCount = 0;
    this.ticksPerFrame = 15;
    this.numberOfFrames = this.currentSpriteArray.length - 1;
    
  }
  /**
   * Represents the possible actions that the player can take (movement, attacking, blocking...)
   * @param {boolean[]} keyArr           - each index represents a keycode and the true/false value of that index represents the state of the key press
   */
  action(keyArr){
    if(keyArr[this.up]){
    if(!this.jumping && this.grounded){
      this.jumping = true;
      this.grounded = false;

      //SET SPRITE ANIMATIONS TO JUMPING - NEED TO CHECK FOR A BETTER WAY TO DO THIS IN THE FUTURE
      this.currentSpriteArray = this.spriteArrays[4];
      this.numberOfFrames = this.currentSpriteArray.length - 1;
      //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      this.yVelocity = -this.speed*2;
    }
    }
    if(keyArr[this.left]){
      if(this.xVelocity < this.speed){
        this.xVelocity++;
      }
      this.playerDirection = 0;
      //SET SPRITE ANIMATIONS TO RUNNING IF NOT JUMPING - NEED TO CHECK FOR A BETTER WAY TO DO THIS IN THE FUTURE
      if(this.jumping == false){
        this.currentSpriteArray = this.spriteArrays[5];
        this.numberOfFrames = this.currentSpriteArray.length - 1;
      }
      //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    }
    if(keyArr[this.right]){
      if(this.xVelocity > -this.speed){
        this.xVelocity--;
      }
      this.playerDirection = 50;
      //SET SPRITE ANIMATIONS TO RUNNING IF NOT JUMPING - NEED TO CHECK FOR A BETTER WAY TO DO THIS IN THE FUTURE
      if(this.jumping == false){
        this.currentSpriteArray = this.spriteArrays[5];
        this.numberOfFrames = this.currentSpriteArray.length - 1;
      }
      //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    }
    

    this.xVelocity *= this.friction;
    this.yVelocity += this.gravity;

    if(this.grounded){
      this.yVelocity = 0;
    }

    this.xCoordinate += this.xVelocity;
    this.yCoordinate += this.yVelocity;
    this.grounded = false;
  }

  attack(keyArr, player){
    if(keyArr[this.kick]){
      //SET SPRITE ANIMATIONS TO JUMPING - NEED TO CHECK FOR A BETTER WAY TO DO THIS IN THE FUTURE
      this.currentSpriteArray = this.spriteArrays[2];
      this.numberOfFrames = this.currentSpriteArray.length - 1;
      //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      if(this.xCoordinate === player.xCoordinate + 40){
        player.xVelocity -= 12;
        player.yVelocity -= 1;
      }
      if(this.xCoordinate === player.xCoordinate - 40){
        player.xVelocity += 12;
        player.yVelocity -= 1;
      }
    }
  }

  respawn(map){
    if(this.yCoordinate > map.canvasHeight){
      this.xCoordinate = map.canvasWidth / 2;
      this.yCoordinate = map.canvasHeight / 2;
      this.xVelocity = 0;
      this.yVelocity = 0;
    }
  }

  collisionPrevention(){
    
    if (this.collisionDirection === "l" || this.collisionDirection === "r") {
      this.xVelocity = 0;
      this.jumping = false;
    } else if (this.collisionDirection === "b") {
      this.grounded = true;
      this.jumping = false;
    } else if (this.collisionDirection === "t") {
      this.yVelocity *= -1;
    }
  }

  spriteUpdate(){
    this.numberOfFrames = this.currentSpriteArray.length - 1;
    this.ticksCount++;
    if(this.ticksCount > this.ticksPerFrame){
      this.ticksCount = 0;
      if(this.frameIndex <  this.numberOfFrames){
        this.frameIndex++;
      } else{
        this.frameIndex = 0;
      }
    }
  }
}


class GameLogic{
  constructor(){
    this.map = new Map(1000, 300);
    this.players = [new Player(this.map.canvasWidth / 8 * 3, 180, 38, 39, 37, 191, './goten-sprite-compressed.png'),
                    new Player(this.map.canvasWidth / 8 * 4.5, 180, 87, 68, 65, 70, 'c17super-sprite-compressed.png')];
    // this.gameRunning = true;
    this.keys = [];
    // this.gameLoop();
  }

  collisionCheck(shapeA, shapeB){
    // get the vectors to check against
    let vX = (shapeA.xCoordinate + (shapeA.width / 2)) - (shapeB.xCoordinate + (shapeB.width / 2));
    let vY = (shapeA.yCoordinate + (shapeA.height / 2)) - (shapeB.yCoordinate + (shapeB.height / 2))
        // add the half widths and half heights of the objects
    let hWidths = (shapeA.width / 2) + (shapeB.width / 2);
    let hHeights = (shapeA.height / 2) + (shapeB.height / 2);
    let colDir = null;
 
    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {         // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX);
        let oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.yCoordinate += oY;
            } else {
                colDir = "b";
                shapeA.yCoordinate -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.xCoordinate += oX;
            } else {
                colDir = "r";
                shapeA.xCoordinate -= oX;
            }
        }
    }
    return colDir;
  }

}

module.exports = GameLogic;