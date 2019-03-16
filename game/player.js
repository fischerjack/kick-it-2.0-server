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
    this.friction = 0;
    this.gravity = 0;
    this.jumping = false;
    this.grounded = false;
    this.collisionDirection = '';

    //playerDirection is either 0 or 50, which will move vertically between the two symmetric levels in the sprite sheet
    this.playerDirection = 50;

    this.up = up;
    this.left = left;
    this.right = right;
    this.kick = kick;
    this.playerImage = new Image();
    this.playerImage.src = spriteSrc;
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
    if(this.yCoordinate > map.canvasHeight && this.lives > 0){
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

  draw(ctx){
    // ctx.drawImage(this.playerImage, this.frameIndex * this.width, this.playerDirection, 40, 50, this.xCoordinate, this.yCoordinate , 40, 50);
    ctx.drawImage(this.playerImage, this.currentSpriteArray[this.frameIndex] * this.width, this.playerDirection, 40, 50, this.xCoordinate, this.yCoordinate , 40, 50);
    this.spriteUpdate();
  }

}