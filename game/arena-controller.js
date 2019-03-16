class ArenaController{

  constructor(friction, gravity, players, map){
    this.canvas = $('#canvas')[0];
    this.ctx = this.canvas.getContext('2d');
    // this.audioCtx = new AudioContext();
    this.canvas.width = map.canvasWidth;
    this.canvas.height = map.canvasHeight;
    this.players = players;
    this.keys = [];
    this.players.forEach(element => {
      element.friction = friction;
      element.gravity = gravity;
    });
    this.map = map;
    $('body')[0].addEventListener('keydown', (e) =>{
      this.keys[e.keyCode] = true;
    });
    $('body')[0].addEventListener('keyup', (e) =>{
      this.keys[e.keyCode] = false;
    });

  }
  

  //Temporary code below this line
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
  //Temporary code above this line
  


  update(){

    //Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //Draw the map
    this.map.draw(this.ctx);

    //Update HTML with player lives (HARDCODED - NEEDS TO BE ABSTRACTED IN THE FUTURE)
    let count = 0;
    this.players.forEach(element => {
      $('div div p span')[count].innerHTML = element.lives;
      count++;
    });
    // $('div')

    //Check player collisions with the map elements and prevent collisions if necessary, then take player actions and draw players
    this.players.forEach(element => {
      for(let i = 0; i < this.map.mapTerrain.length; i++){
        element.collisionDirection = this.collisionCheck(element, this.map.mapTerrain[i]);
        element.collisionPrevention();
      }
      this.players.forEach(e => {
        if(element !== e){
          element.collisionDirection = this.collisionCheck(element, e);
          if(element.collisionDirection == 'l' || element.collisionDirection == 'r'){
            element.collisionPrevention();
          } else if(element.collisionDirection == 't'){
            e.grounded = true;
            e.jumping = false;
            element.jumping = true;
          } else if(element.collisionDirection == 'b'){
            e.jumping = false;
            element.grounded = true;
            element.jumping = false;
          }
          element.attack(this.keys, e);
        }
      });
      
      element.action(this.keys);
      element.respawn(this.map);
      element.draw(this.ctx);

      //RESET SPRITE ANIMATIONS TO IDLE - NEED TO CHECK FOR A BETTER WAY TO DO THIS IN THE FUTURE
      if(element.jumping == false){
        element.currentSpriteArray = element.spriteArrays[0];
        element.numberOfFrames = element.currentSpriteArray.length - 1;
      }
      //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    });
    
    //Get next animation frame
    requestAnimationFrame(() => this.update());
  }
}

