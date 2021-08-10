export { player, mob, polyMob, starMob, squareMob, splitter, butFly, teleport, tether };

let ctx = gameCanvas.getContext("2d");

class player {
  constructor() {
    this.cenX = 300;
    this.cenY = 500;
    this.vertArray = [];
    this.invincible = false;
    this.lineCol = 'black';
    this.fillCol = 'grey';
  }
  updateVerts() {
    let tempArray = [];
    let halfHeight = 20;
    let halfWidth = 10;

    tempArray.push({x: this.cenX, y: (this.cenY - halfHeight)});
    tempArray.push({x: (this.cenX + halfWidth), y: this.cenY});
    tempArray.push({x: this.cenX, y: (this.cenY + halfHeight)});
    tempArray.push({x: (this.cenX - halfWidth), y: this.cenY});

    this.vertArray = tempArray;
  }
  drawShape() {
    ctx.beginPath();
    ctx.lineJoin = 'round';
    ctx.strokeStyle = this.lineCol;
    ctx.fillStyle = this.fillCol;
    ctx.lineWidth = 3;
    for (let i = 0; i < this.vertArray.length; i++){
      ctx.lineTo(this.vertArray[i].x, this.vertArray[i].y);
      }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}

class mob {
  constructor(array) {
    this.mobType = array[0];
    this.cenX = array[1];
    this.cenY = array[2];
    this.genus = array[3]; //number of sides or hits object can take
    this.movesIn = array[4]; //frames to wait before movement
    this.shoots = array[5];
    this.vertArray = [];
    this.theta = 0;
    this.thetaToPlayer = 0; //angle from cenX,cenY to player center
    this.deltaXToPlayer = 0;
    this.deltaYToPlayer = 0;
    this.fullCirc = Math.PI * 2; // 360 degrees expressed in radians
    this.tic = Math.PI / 720; // One tic = 1/4 degree expressed in radians
  }

  updateDeltaToPlayer(player1) {
    this.deltaXToPlayer = Math.abs(this.cenX - player1.cenX);
    this.deltaYToPlayer = Math.abs(this.cenY - player1.cenY);
  }
}

class polyMob extends mob {
  constructor(array) {
    super(array);
    this.lineCol = 'red';
    this.fillCol = 'orange';
    this.radius = 20;
    this.rotDir = Math.floor(Math.random() * 2); if (this.rotDir == 0) {this.rotDir = -1};  //0 = no rotation, 1 = clockwise, -1 = counterclock
    this.rotSpeed = 4;
  }

  updateVerts() {
    let tempArray = [];
    let arcSeg = this.fullCirc/this.genus;
    let xVal, yVal;
    for (let i = 0; i < this.genus; i++) {
      xVal = Math.round(Math.cos(this.theta + (arcSeg * i)) * this.radius + this.cenX);
      yVal = Math.round(Math.sin(this.theta + (arcSeg * i)) * this.radius + this.cenY);
      //yVal = Math.round(Math.sin(arcSeg * i) * this.radius + this.cenY);
      tempArray.push({x: xVal, y: yVal});
    }
    this.vertArray = tempArray;
  }
  drawShape() {
    ctx.beginPath();
    ctx.lineJoin = 'round';
    ctx.strokeStyle = this.lineCol;
    ctx.fillStyle = this.fillCol;
    ctx.lineWidth = 3;
    for (let i = 0; i < this.vertArray.length; i++) {
      ctx.lineTo(this.vertArray[i].x, this.vertArray[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  updateBaseVal() {
    //this.cenX = (Math.cos(this.theta) * 1.5) + this.cenX;
    this.cenY = (this.cenY + 2);
    if (this.cenY > 630) {
      this.cenY = -30;
    }
    this.theta = this.theta + (this.rotDir * this.tic * this.rotSpeed);
    if (Math.abs(this.theta) > this.fullCirc) {
      this.theta = this.theta % this.fullCirc;
    }
    //console.log(this.theta);
  }
}

class starMob extends mob {
  constructor(array) {
    super(array);
    this.lineCol = 'blue';
    this.fillCol = 'green';
    this.radius = 20;
  }
  updateVerts() {
    let tempArray = [];
    let arcSeg = this.fullCirc/this.genus;
    let halfSeg = arcSeg/2;
    let xVal, yVal;
    for (let i = 0; i < this.genus; i++) {
      xVal = Math.round(Math.cos(arcSeg * i) * this.radius + this.cenX);
      yVal = Math.round(Math.sin(arcSeg * i) * this.radius + this.cenY);
      tempArray.push({x: xVal, y: yVal});
      xVal = Math.round(Math.cos((arcSeg * i) + halfSeg) * (this.radius * .6) + this.cenX);
      yVal = Math.round(Math.sin((arcSeg * i) + halfSeg) * (this.radius * .6) + this.cenY);
      tempArray.push({x: xVal, y: yVal});
    }
    this.vertArray = tempArray;
  }
  drawShape() {
    ctx.beginPath();
    ctx.lineJoin = 'round';
    ctx.strokeStyle = this.lineCol;
    ctx.fillStyle = this.fillCol;
    ctx.lineWidth = 3;
    for (let i = 0; i < this.vertArray.length; i++) {
      ctx.lineTo(this.vertArray[i].x, this.vertArray[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  updateBaseVal() {
    this.cenY = (this.cenY + .5);
    if (this.cenY > 630) {
      this.cenY = -30;
    }
  }
}
  
class squareMob extends mob {
  constructor(array) {
    super(array);
    this.lineCol = 'blue';
    this.fillCol = 'green';
    this.vertArray2 = [];
    this.vertArray3 = [];
  }
  updateVerts() {
    let tempArray = [];
    let tempArray2 = [];
    let tempArray3 = [];
    let halfSq = 34; 
    let thirdSq = 19;
    let xVal
    let yVal
    
    //draw outline
    tempArray.push({x: (this.cenX + halfSq), y: (this.cenY + thirdSq)});
    tempArray.push({x: (this.cenX + thirdSq), y: (this.cenY + halfSq)});
    tempArray.push({x: (this.cenX + -thirdSq), y: (this.cenY + halfSq)});
    tempArray.push({x: (this.cenX + -halfSq), y: (this.cenY + thirdSq)});
    tempArray.push({x: (this.cenX + -halfSq), y: (this.cenY + -thirdSq)});
    tempArray.push({x: (this.cenX + -thirdSq), y: (this.cenY + -halfSq)});
    tempArray.push({x: (this.cenX + thirdSq), y: (this.cenY + -halfSq)});
    tempArray.push({x: (this.cenX + halfSq), y: (this.cenY + -thirdSq)});
    this.vertArray = tempArray;
    //draw cross
    tempArray2.push({x: (this.cenX + halfSq), y: this.cenY});
    tempArray2.push({x: (this.cenX + -halfSq), y: this.cenY});
    tempArray2.push({x: this.cenX, y: (this.cenY + halfSq)});
    tempArray2.push({x: this.cenX, y: (this.cenY + -halfSq)});
    this.vertArray2 = tempArray2;
    //draw gun
    tempArray3.push({x: this.cenX, y: this.cenY});
    xVal = Math.round(Math.cos(this.thetaToPlayer) * 60 + this.cenX);
    yVal =Math.round(Math.sin(this.thetaToPlayer) * 60 + this.cenY);
    tempArray3.push({x: xVal, y: yVal});
    this.vertArray3 = tempArray3;
  }

  drawShape() {
    //draw outline and fill
    ctx.beginPath();
    ctx.lineJoin = 'round';
    ctx.strokeStyle = this.lineCol;
    ctx.fillStyle = this.fillCol;
    ctx.lineWidth = 3;
    for (let i = 0; i < this.vertArray.length; i++) {
      ctx.lineTo(this.vertArray[i].x, this.vertArray[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    //draw cross
    ctx.beginPath();
    ctx.moveTo(this.vertArray2[0].x, this.vertArray2[0].y);
    ctx.lineTo(this.vertArray2[1].x, this.vertArray2[1].y);
    ctx.moveTo(this.vertArray2[2].x, this.vertArray2[2].y);
    ctx.lineTo(this.vertArray2[3].x, this.vertArray2[3].y);
    ctx.stroke();
    //draw gun
    ctx.beginPath();
    ctx.moveTo(this.vertArray3[0].x, this.vertArray3[0].y);
    ctx.lineTo(this.vertArray3[1].x, this.vertArray3[1].y);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.strokeStyle = this.lineCol;
  }
  updateBaseVal(player1) {
    this.cenY = (this.cenY + 1.5);
    if (this.cenY > 630) {
      this.cenY = -30;
    }

    let dx = (player1.cenX - this.cenX);
    let dy = (player1.cenY - this.cenY);
    this.thetaToPlayer = Math.atan2(dy, dx);
    if (this.thetaToPlayer < 0) {
      this.thetaToPlayer = ((Math.PI + this.thetaToPlayer) + Math.PI);
    }
  }
}

class splitter {
  
}

class butFly {
  
}

class teleport {
  
}

class tether extends mob { // Use shadow for shield.

}