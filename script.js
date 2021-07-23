var gameLoop = null;
var start = document.getElementById("start");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var healthDisplay = document.getElementById("health");
var waveDisplay = document.getElementById("wave");
var scoreDisplay = document.getElementById("scoreDisplay");
var highScoreDisplay = document.getElementById("highScoreDisplay");
var timeDisplay = document.getElementById("time");

var time = 0;

var width = 1000;
var height = 600;

var fireRate = 50;

canvas.width = width;
canvas.height = height;

var maxHp = 90;
var waveNum = 1;
var laserNum = -2;
var laserFactor = 0;
var spawnRadius = 100;
var shooters = [];
var playerBulletRadius = 2.8;
var playerBulletSpeed = 3;
var playerBulletErrorRate = 0;
var movingUp = false;
var movingDown = false;
var movingLeft = false;
var movingRight = false;
var playerSpeed = 1;
var score = 0;
var highScore = 0;

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function getMousePos(event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
}

document.onkeypress = function(evt) {
    var evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    keyEvents(charStr, evt);
}

function click(event) {
    var pos = getMousePos(event);
    
}

function drawRect(x, y, width, height, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.stroke();
}

class Bullet {
    constructor(posX, posY, radius, velocityX, velocityY, strength, parent) {
        this.pos = [posX, posY];
        this.velocity = [velocityX, velocityY];
        this.radius = radius;
        this.strength = strength;
        this.parent = parent;
        this.index = 0;
    }

    move() {
        if (this.pos[0] < 0 || this.pos[0] > width || this.pos[1] < 0 || this.pos[1] > height) {
            this.index = this.parent.bullets.indexOf(this);
            this.parent.bullets.splice(this.index, 1);
        }
        this.pos[0] -= this.velocity[0];
        this.pos[1] -= this.velocity[1];
    }

    checkIfHit(shooter) {
        //Benevolent Hitboxes
        if (this.pos[0] > (shooter.pos[0] - shooter.radius) && this.pos[0] < (shooter.pos[0] + shooter.radius) && this.pos[1] > (shooter.pos[1] - shooter.radius) && this.pos[1] < (shooter.pos[1] + shooter.radius)) {
            shooter.hp -= this.strength;
            this.index = this.parent.bullets.indexOf(this);
            this.parent.bullets.splice(this.index, 1);
            return true;
        }
        
        return false;
    }

    draw(color) {
        ctx.beginPath();
        ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

class Shooter {
    constructor(posX, posY, radius, hp, strength, color, parent) {
        this.pos = [posX, posY];
        this.radius = radius;
        this.hp = hp;
        this.strength = strength;
        this.direction = 0;
        this.color = color;
        this.bullets = [];
        this.index = 0;
        this.parent = parent;
    }

    shoot(shootPosX, shootPosY, bulletRadius, bulletSpeed, errorRate) {
        var shootX = this.pos[0] - shootPosX;
        var shootY = this.pos[1] - shootPosY;
        var whole = Math.abs(shootX) + Math.abs(shootY);
        let bullet = new Bullet(this.pos[0], this.pos[1], bulletRadius, shootX / whole * bulletSpeed + (Math.random() * (errorRate * 2) - errorRate), shootY / whole * bulletSpeed + (Math.random() * (errorRate * 2) - errorRate), this.strength, this, this.bullets.length);
        this.bullets.push(bullet);
    }

    update() {
        if (this.hp <= 0) {
            this.index = this.parent.indexOf(this);
            this.parent.splice(this.index, 1);
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

let player = new Shooter(canvas.width / 2, canvas.height / 2, 10, 100, 10, "blue", shooters);
shooters.push(player);

function spawnEnemies(enemyNum, radius, hp, strength, color) {
    for (var i = 0; i < enemyNum; i++) {
        let newEnemy = new Shooter(getRandomIntInclusive(0, canvas.width), getRandomIntInclusive(0, canvas.height), radius, hp, strength, color, shooters);
        shooters.push(newEnemy);
    }
} 

function keyEvents(event, evt) {
    switch(event) {
        case "w":
            if (movingUp) {
                movingUp = false;
            } else {
                movingUp = true;
                movingDown = false;
            }
            break;

        case "a":
            if (movingLeft) {
                movingLeft = false;
            } else {
                movingLeft = true;
                movingRight = false;
            }
            break;

        case "s":
            if (movingDown) {
                movingDown = false;
            } else {
                movingDown = true;
                movingUp = false;
            }
            break;

        case "d":
            if (movingRight) {
                movingRight = false;
            } else {
                movingRight = true;
                movingLeft = false;
            }
            break;
    }
}

function shootAtMousePos(event) {
    var pos = getMousePos(event);
    player.shoot(pos.x, pos.y, playerBulletRadius, playerBulletSpeed, playerBulletErrorRate);
}

scoreDisplay.innerHTML = "Score: " + score.toString();
highScore = getCookie("HighScore");
highScoreDisplay.innerHTML = "High Score: " + highScore.toString();

var reload = 0;
function main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (shooters.length == 1) {
        maxHp += 10;
        player.hp = maxHp;
        playerBulletRadius += 0.2;
        playerBulletSpeed += 0.2;
        spawnEnemies(waveNum, 10, 50, 3, "red");
        spawnEnemies(Math.floor(waveNum / 3), 20, 100, 6, "white");
        waveNum++;
        playerSpeed += 0.2;
        spawnEnemies(laserFactor, 5, 70, 1, "yellow");
        if (laserNum > 0) {
            laserFactor++;
            laserNum = -3;
        } else {
            laserNum++;
        }
    }
    for (var i = 0; i < shooters.length; i++) {
        shooters[i].draw();
        shooters[i].update();
        for (var j = 0; j < shooters[i].bullets.length; j++) {
            shooters[i].bullets[j].draw("violet");
            shooters[i].bullets[j].move();
            for (var k = 0; k < shooters.length; k++) {
                if (shooters[k] != shooters[i]) {
                    if (j < shooters[i].bullets.length) {
                        var killed = shooters[i].bullets[j].checkIfHit(shooters[k]);
                        if (killed) {
                            if (shooters[k].color == "red") {
                                score++;

                            } else if (shooters[k].color == "yellow") {
                                score += 5;

                            } else if (shooters[k].color == "white") {
                                score += 10;

                            }
                        }

                        if (score > highScore) {
                            console.log(score);
                            console.log(highScore);
                            highScore = score;
                            setCookie("HighScore", highScore, 3650);
                        }
                    }
                }
            }
        }
    }
    
    for (var i = 0; i < shooters.length; i++) {
        if (reload <= 0) {
            if (shooters[i].color == "red") {
                shooters[i].shoot(player.pos[0], player.pos[1], 5, 3, 0);
            } else if (shooters[i].color == "white") {
                shooters[i].shoot(player.pos[0], player.pos[1], 10, 2, 0)
            }
        }

        if (shooters[i].color == "yellow") {
            shooters[i].shoot(player.pos[0], player.pos[1], 3, 7, 0);
        }
    }
    if (reload <= 0) {
        reload = fireRate;
    } else {
        reload--;
    }
    healthDisplay.innerHTML = "Health: " + player.hp.toString();
    waveDisplay.innerHTML = "Wave: " + (waveNum - 1).toString();
    
    if (movingUp) {
        if (player.pos[1] - player.radius > 0 && player.hp >= 0) {
            player.pos[1] -= playerSpeed;
        }
    }

    if (movingLeft) {
        if (player.pos[0] - player.radius > 0 && player.hp >= 0) {
            player.pos[0] -= playerSpeed;
        }
    }

    if (movingDown) {
        if (player.pos[1] + player.radius < canvas.height && player.hp >= 0) {
            player.pos[1] += playerSpeed;
        }
    }

    if (movingRight) {
        if (player.pos[0] + player.radius < canvas.width && player.hp >= 0) {
            player.pos[0] += playerSpeed;
        }
    }

    if (player.hp <= 0) {
        ctx.font = '48px comicsansms';
        ctx.strokeText('Game Over 游戏结束', canvas.width / 2, canvas.height / 2);
        clearInterval(gameLoop);
    }

    scoreDisplay.innerHTML = "Score: " + score.toString();
    highScoreDisplay.innerHTML = "High Score: " + getCookie("HighScore");

    time += 0.01;
    timeDisplay.innerHTML = "Time Spent Playing: " + Math.floor(time).toString() + " Seconds"

}

function startGame() {
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    maxHp = 90;
    waveNum = 1;
    laserNum = -2;
    laserFactor = 0;
    shooters = [];
    playerBulletRadius = 2.8;
    playerBulletSpeed = 2.8;
    playerBulletErrorRate = 0;
    movingUp = false;
    movingDown = false;
    movingLeft = false;
    movingRight = false;
    playerSpeed = 1;

    player.hp = 100;
    player.pos[0] = canvas.width / 2;
    player.pos[1] = canvas.height / 2;
    player.strength = 10;
    shooters.push(player);

    reload = 0;

    gameLoop = setInterval(main, 10);
    start.innerHTML = "Restart Game";
}











































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































