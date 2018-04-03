var player;

var obstacles = [];

function startGame() {
    player = new component(30, 30, "black", 80, 75);
    myGameArea.start();
}

var myGameArea = {
    canvas : document.getElementById("canvas"),
    start : function() {
        this.canvas.width = 500;
        this.canvas.height = 290;
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0; 
        this.interval = setInterval(updateGameArea, 20);       
    },
    stop : function() {
        clearInterval(this.interval);
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    
    this.speedX = 0;
    this.speedY = 0;    
    this.gravity = 0.1;
    this.gravitySpeed = 0;
    this.bounce = 0.6;
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
        }
    }
    this.collidesWith = function (otherObject) {
        var myLeft = this.x;
        var myRight = this.x + (this.width);
        var myTop = this.y;
        var myBottom = this.y + (this.height);

        var otherLeft = otherObject.x;
        var otherRight = otherObject.x + (otherObject.width);
        var otherTop = otherObject.y;
        var otherBottom = otherObject.y + (otherObject.height);

        var collides = true;
        if ((myBottom < otherTop) || (myTop > otherBottom) || (myRight < otherLeft) || (myLeft > otherRight)) {
            collides = false;
        }
        return collides;
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function updateGameArea() {
    var x;
    var y;

    for (i = 0; i < obstacles.length; i += 1) {
        if (player.collidesWith(obstacles[i])) {
            myGameArea.stop();
            return;
        } 
    }

    createObstacles();

    myGameArea.clear();

    for (i = 0; i < obstacles.length; i += 1) {
        obstacles[i].x += -1;
        obstacles[i].update();
    }

    player.newPos();
    player.update();
}

function createObstacles() {
    myGameArea.frameNo += 1;

    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;

        minHeight = 20;
        maxHeight = 150;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);

        minGap = 50;
        maxGap = 200;

        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);

        obstacles.push(new component(10, height, "black", x, 0));
        obstacles.push(new component(10, x - height - gap, "black", x, height + gap));
    }
}

document.getElementById("canvas").addEventListener("mousedown", jump);
document.getElementById("canvas").addEventListener("mouseup", applyGravity);

function jump() {
    if (!myGameArea.interval) {myGameArea.interval = setInterval(updateGameArea, 20);}

    player.gravity = -0.2;
}

function applyGravity() {
    if (!myGameArea.interval) {myGameArea.interval = setInterval(updateGameArea, 20);}

    player.gravity = 0.1; 
}

function restartGame() {
    myGameArea.stop();
    myGameArea.clear();
    obstacles = [];
    document.getElementById("canvas").innerHTML = "";
    startGame();
}

