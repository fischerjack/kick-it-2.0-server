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
    // this.mapTerrain.push({
    //   xCoordinate: 0,
    //   yCoordinate: canvasHeight - 2,
    //   width: canvasWidth,
    //   height: 50
    // });
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

  draw(ctx){
    ctx.fillStyle = "black";
    ctx.beginPath();
    for (let i = 0; i < this.mapTerrain.length; i++) {
      ctx.rect(this.mapTerrain[i].xCoordinate, this.mapTerrain[i].yCoordinate, this.mapTerrain[i].width, this.mapTerrain[i].height);
    }
    ctx.fill();
  }
}