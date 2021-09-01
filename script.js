//x0, y0, x1, y1
//a = |x0 - x1|
//b = |y0 - y1|
//c = a + b
//d = 1 / sqrt((a)^2 + (b)^2)
//Move a/c*d and b/c*d
var gameLoop = null;
var muteButton = document.getElementById("mute");
var difficultyDisplay = document.getElementById("difficulty");
var type = document.getElementById("type");
var cheats = document.getElementById("cheats");
var start = document.getElementById("start");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var healthDisplay = document.getElementById("health");
var waveDisplay = document.getElementById("wave");
var scoreDisplay = document.getElementById("scoreDisplay");
var highScoreDisplay = document.getElementById("highScoreDisplay");
var timeDisplay = document.getElementById("time");
var gameMusic = document.getElementById("music");
gameMusic.loop = true;

var winTime = 0;
var isPlaying = true;

var time = 0;

var width = 1000;
var height = 600;

var fireRate = 50;

canvas.width = width;
canvas.height = height;

var muted = false;
var mode = 1;
var regenRate = 1;
var maxHp = 90;
var waveNum = 1;
var laserNum = -2;
var laserFactor = 0;
var spawnRadius = 100;
var shooters = [];
var deadBullets = [];
var playerBulletRadius = 5;
var playerBulletSpeed = 3;
var playerBulletErrorRate = 0;
var movingUp = false;
var movingDown = false;
var movingLeft = false;
var movingRight = false;
var playerSpeed = 1;
var score = 0;
var highScore = 0;
var google = false;
var specialAttackType = 0;
var specialAttackCooldowns = [2, 0.5, 1, 1, 0];//Add more special attacks in the future.
var specialAttackCooldownsOffset = [2, 0.5, 1, 1, 0];//Add more special attacks in the future.
var map0 = [[1, 1, 10, 10], [1, 1, 3]];//array with 4 values is a rectangle, array with 3 values is a circle
var maps = [map0];

muteButton.onclick = function() {
    if (muted) {
        muted = false;
        gameMusic.pause();
        muteButton.innerHTML = "Unmute";
    } else {
        muted = true;
        gameMusic.play();
        muteButton.innerHTML = "Mute";
    }
}

difficultyDisplay.onclick = function() {
    switch(mode) { 
        case 0: 
            mode = 1; 
            difficultyDisplay.innerHTML = "Normal Mode";
            difficultyDisplay.style.backgroundColor = 'orange';
            break; 
        
        case 1: 
            mode = 2; 
            difficultyDisplay.innerHTML = "Hard Mode";
            difficultyDisplay.style.backgroundColor = 'red';
            break; 
        
        case 2: 
            mode = 3; 
            difficultyDisplay.innerHTML = "Extreme Mode";
            difficultyDisplay.style.backgroundColor = 'purple';
            break; 

        case 3: 
            mode = 0; 
            difficultyDisplay.innerHTML = "Easy Mode";
            difficultyDisplay.style.backgroundColor = 'lightgreen';
            break; 
    }
}

type.onclick = function() {
    switch(specialAttackType) {
        case 0:
            specialAttackType = 1;
            type.innerHTML = "Explosion Special Attack";
            type.style.backgroundColor = 'red';
            break;
        
        case 1:
            specialAttackType = 2;
            type.innerHTML = "Teleport Special Attack";
            type.style.backgroundColor = 'blue';
            break;

        case 2:
            specialAttackType = 3;
            type.innerHTML = "Suck Special Attack";
            type.style.backgroundColor = 'Orange';
            break;

        case 3:
            specialAttackType = 4;
            type.innerHTML = "Push Special Attack";
            type.style.backgroundColor = 'blue';
            break;

        case 4:
            specialAttackType = 5;
            type.innerHTML = "Dodge Special Attack";
            type.style.backgroundColor = 'green';
            break;

        case 5:
            specialAttackType = 0;
            type.innerHTML = "No Special Attack";
            type.style.backgroundColor = 'white';
            break;
    }
}

cheats.onclick = function() {
    specialAttackCooldownsOffset = [0, 0, 0, 0, 0];
}

function playShootSFX() {
    if (muted) {
        var music = new Audio("/SFX/Shoot.wav");
        music.play();
    }
}

function playHitSFX() {
    if (muted) {
        var music = new Audio("/SFX/Hit.wav");
        music.play();
    }
}

function playHit1SFX() {
    if (muted) {
        var music = new Audio("/SFX/Hit1.wav");
        music.play();
    }
}

function playWinSFX() {
    if (muted) {
        var music = new Audio("/SFX/Win.wav");
        music.play();
    }
}

function playGameOverSFX() {
    if (muted) {
        var music = new Audio("/SFX/GameOver.mp3");
        music.play();
    }
}

function playBoomSFX() {
    if (muted) {
        var music = new Audio("/SFX/Boom.wav");
        music.play();
    }
}

function playMusic() {
    if (muted) {
        gameMusic.play();
    }
}

function pauseMusic() {
    gameMusic.pause();
}

Math.dist=function(x1,y1,x2,y2){ 
  if(!x2) x2=0; 
  if(!y2) y2=0;
  return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)); 
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

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

canvas.addEventListener('click', function(evt) {
    var pos = getMousePos(event);  
});

canvas.addEventListener('contextmenu', function(evt) {
    evt.preventDefault();
    var pos = getMousePos(event);
    if (specialAttackType == 1) {
        
        if (specialAttackCooldowns[0] >= specialAttackCooldownsOffset[0]) {
            explode(player, [pos.x, pos.y], 100, 3, 0, 3, 1, 0);//Only certain modes, only certain places, cooldown
            specialAttackCooldowns[0] = 0;
        }
    } else if (specialAttackType == 2) {
        if (specialAttackCooldowns[1] >= specialAttackCooldownsOffset[1]) {
            teleport(player, [pos.x, pos.y]);//Only certain modes, only certain places, cooldown
            specialAttackCooldowns[1] = 0;
        }
    } else if (specialAttackType == 3) {
        if (specialAttackCooldowns[2] >= specialAttackCooldownsOffset[2]) {
            suck(player, [pos.x, pos.y]);
            specialAttackCooldowns[2] = 0;
        }
    }  else if (specialAttackType == 4) {
        if (specialAttackCooldowns[3] >= specialAttackCooldownsOffset[3]) {
            push(player, [pos.x, pos.y]);
            specialAttackCooldowns[3] = 0;
        }
    } else if (specialAttackType == 5) {
        if (specialAttackCooldowns[4] >= specialAttackCooldownsOffset[3]) {
            specialAttackCooldowns[4] = 0;
        }
    }
});

function drawRect(x, y, width, height, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.stroke();
}

function makeImage(path, left, top, width, height) {
    baseImage = new Image();
    baseImage.src = path;
    baseImage.onload = function(){
        ctx.drawImage(baseImage, left, top, width, height);
    }
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
        //Not Benevolent Hitboxes
        if (Math.dist(this.pos[0], this.pos[1], shooter.pos[0], shooter.pos[1]) <= this.radius + shooter.radius) {
            shooter.hp -= this.strength;
            this.index = this.parent.bullets.indexOf(this);
            this.parent.bullets.splice(this.index, 1);
            playHitSFX();
            return true;
        }
        return false;
    }

    deleteSelf() {
        this.index = this.parent.bullets.indexOf(this);
        this.parent.bullets.splice(this.index, 1);
    }

    draw(color) {
        ctx.beginPath();
        ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

class Shooter {
    constructor(posX, posY, radius, hp, strength, color, parent, speed, sightRange) {
        this.pos = [posX, posY];
        this.radius = radius;
        this.hp = hp;
        this.strength = strength;
        this.direction = 0;
        this.color = color;
        this.bullets = [];
        this.index = 0;
        this.parent = parent;
        this.speed = speed;
        this.sight = sightRange
    }

    shoot(shootPosX, shootPosY, bulletRadius, bulletSpeed, errorRate) {
        var shootX = this.pos[0] - shootPosX;
        var shootY = this.pos[1] - shootPosY;
        var whole = Math.abs(shootX) + Math.abs(shootY);
        var circle = 1 / Math.dist(0, 0, shootX / whole, shootY / whole);
        let bullet = new Bullet(this.pos[0], this.pos[1], bulletRadius, shootX / whole * bulletSpeed * circle + (Math.random() * (errorRate * 2) - errorRate), shootY / whole * bulletSpeed * circle + (Math.random() * (errorRate * 2) - errorRate), this.strength, this, this.bullets.length);
        this.bullets.push(bullet);
        playShootSFX();
    }

    create(pos, shootPosX, shootPosY, bulletRadius, bulletSpeed, errorRate) {
        var shootX = pos[0] - shootPosX;
        var shootY = pos[1] - shootPosY;
        var whole = Math.abs(shootX) + Math.abs(shootY);
        var circle = 1 / Math.dist(0, 0, shootX / whole, shootY / whole);
        let bullet = new Bullet(pos[0], pos[1], bulletRadius, shootX / whole * bulletSpeed * circle + (Math.random() * (errorRate * 2) - errorRate), shootY / whole * bulletSpeed * circle + (Math.random() * (errorRate * 2) - errorRate), this.strength, this, this.bullets.length);
        this.bullets.push(bullet);
    }

    update() {
        if (this.hp <= 0) {
            this.index = this.parent.indexOf(this);
            this.parent.splice(this.index, 1);
            this.parent.bullets = [];
            for (var i = 0; i < this.bullets.length; i++) {
                player.bullets.push(this.bullets[i]);
                this.bullets[i].parent = player;
            }
            playBoomSFX();
        }
    }

    draw() {
        if (!google) {
            ctx.beginPath();
            ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        } else {
            makeImage("/SpriteImages/Chrome.png", this.pos[0] - this.radius, this.pos[1] - this.radius, this.radius * 2, this.radius * 2);
        }
    }
}

let player = new Shooter(canvas.width / 2, canvas.height / 2, 10, 100, 10, "blue", shooters, playerSpeed, 100);
function clearEnemies() {
    shooters = [];
    shooters.push(player);
}
shooters.push(player);

function spawnEnemies(enemyNum, radius, hp, strength, color, speed, range) {
    for (var i = 0; i < enemyNum; i++) {
        let newEnemy = new Shooter(getRandomIntInclusive(0, canvas.width), getRandomIntInclusive(0, canvas.height), radius, hp, strength, color, shooters, speed, range);
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

        case "v":
            if (isPlaying) {
                isPlaying = false;
            } else {
                isPlaying = true;
                playMusic();
            }
            break;
        
        case "f":
            if (mode == 0 || mode == 2) {
                for (var i = 0; i < shooters.length; i++) {
                    var enemy = shooters[i];
                    if (enemy.color != "blue") {
                        player.shoot(enemy.pos[0], enemy.pos[1], Math.ceil(playerBulletRadius / (shooters.length - 1)), playerBulletSpeed, playerBulletErrorRate);
                    }
                }
            }
    }
}

function shootAtMousePos(event) {
    var pos = getMousePos(event);
    player.shoot(pos.x, pos.y, playerBulletRadius, playerBulletSpeed, playerBulletErrorRate);
}

function calcVelocity(pos1, pos2) {
    var shootX = pos1[0] - pos2[0];
    var shootY = pos1[1] - pos2[1];
    var whole = Math.abs(shootX) + Math.abs(shootY);
    var circle = 1 / Math.dist(0, 0, shootX / whole, shootY / whole);
    return [shootX / whole * circle, shootY / whole * circle];
}

function push(shooter, pos) {
    for (var i = 0; i < shooters.length; i++) {
        for (var j = 0; j < shooters[i].bullets.length; j++) {
            let curVel = calcVelocity(shooters[i].bullets[j].pos, pos);
            shooters[i].bullets[j].velocity = [curVel[0] * -1, curVel[1] * -1];
        }
    }
}

function suck(shooter, pos) {
    for (var i = 0; i < shooters.length; i++) {
        for (var j = 0; j < shooters[i].bullets.length; j++) {
            let curVel = calcVelocity(shooters[i].bullets[j].pos, pos);
            shooters[i].bullets[j].velocity = curVel;
        }
    }
}

function teleport(shooter, pos) {
    explode(shooter, shooter.pos, 100, 45, 0, 3, 5, 0);
    shooter.pos = pos;
}

function explode(shooter, pos, radius, angleFactor, turn, bulletRadius, bulletSpeed, badRate) {
    for (var i = 0; i < Math.round(360 / angleFactor); i++) {
        var angle = i * (angleFactor) + turn;
        var x = Math.round(radius * Math.sin(Math.PI * 2 * angle / 360) + pos[0]);
        var y = Math.round(radius * Math.cos(Math.PI * 2 * angle / 360) + pos[1]);
        shooter.create(pos, x, y, bulletRadius, bulletSpeed, badRate);
    }
    playBoomSFX();
}

function dodgeAttack(shooter, bullet) {
    if (shooter == player) {
        shooter.shoot(bullet.parent.pos[0], bullet.parent.pos[1], 1, playerBulletSpeed, 0);
    }
}

function enemyAI(shooter, bullet) {
    if (Math.dist(shooter.pos[0], shooter.pos[1], bullet.pos[0], bullet.pos[1]) <= shooter.sight) {
        if (bullet.pos[0] > shooter.pos[0]) {
            if (bullet.pos[1] > shooter.pos[1]) {
                if (shooter.pos[0] - shooter.radius > 0) {
                    shooter.pos[0] -= shooter.speed;
                    dodgeAttack(shooter, bullet);
                } if (shooter.pos[1] - shooter.radius > 0) {
                    shooter.pos[1] -= shooter.speed;
                    dodgeAttack(shooter, bullet);
                }
            } else if (bullet.pos[1] < shooter.pos[1]) {
                if (shooter.pos[0] - shooter.radius > 0) {
                    shooter.pos[0] -= shooter.speed;
                    dodgeAttack(shooter, bullet);
                } if (shooter.pos[1] + shooter.radius < canvas.height) {
                    shooter.pos[1] += shooter.speed;
                    dodgeAttack(shooter, bullet);
                }
            } else {
                if (shooter.pos[0] - shooter.radius > 0) {
                    shooter.pos[0] -= shooter.speed;
                    dodgeAttack(shooter, bullet);
                }
            }
        } else if (bullet.pos[0] < shooter.pos[0]) {
            if (bullet.pos[1] > shooter.pos[1]) {
                if (shooter.pos[0] + shooter.radius < canvas.width) {
                    shooter.pos[0] += shooter.speed;
                    dodgeAttack(shooter, bullet);
                } if (shooter.pos[1] - shooter.radius > 0) {
                    shooter.pos[1] -= shooter.speed;
                    dodgeAttack(shooter, bullet);
                }
            } else if (bullet.pos[1] < shooter.pos[1]) {
                if (shooter.pos[0] + shooter.radius < canvas.width) {
                    shooter.pos[0] += shooter.speed;
                    dodgeAttack(shooter, bullet);
                } if (shooter.pos[1] + shooter.radius < canvas.height) {
                    shooter.pos[1] += shooter.speed;
                    dodgeAttack(shooter, bullet);
                }
            } else {
                if (shooter.pos[0] + shooter.radius < canvas.width) {
                    shooter.pos[0] += shooter.speed;
                    dodgeAttack(shooter, bullet);
                }
            }
        } else {
            if (bullet.pos[1] > shooter.pos[1]) {
                if (shooter.pos[1] - shooter.radius > 0) {
                    shooter.pos[1] -= shooter.speed;
                    dodgeAttack(shooter, bullet);
                }
            } else if (bullet.pos[1] < shooter.pos[1]) {
                if (shooter.pos[1] + shooter.radius < canvas.height) {
                    shooter.pos[1] += shooter.speed;
                    dodgeAttack(shooter, bullet);
                }
            }
        }
    }
}

function mapReader(mapNum) {
    curMap = maps[mapNum];//Map reader, can create circles, rectangles and shooters, and bomb thingys or something, idk it hasen't been made yet.
}

scoreDisplay.innerHTML = "Score: " + score.toString();
highScore = getCookie("HighScore");
highScoreDisplay.innerHTML = "High Score: " + highScore.toString();

var reload = 0;
function main() {
    if (isPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (shooters.length == 1) {
            if (waveNum > 1) {
                winTime = 100;
            }
            if (mode != 3) {
                maxHp += 10;
                player.hp = maxHp;
                playerBulletRadius += 0.2;
                playerBulletSpeed += 0.2;
                regenRate += 0.2
                playerSpeed += 0.2;
            }
            spawnEnemies(waveNum, 10, 50, 10, "red", 1, 50);
            spawnEnemies(Math.floor(waveNum / 3), 20, 100, 30, "white", 1, 100);
            waveNum++;
            spawnEnemies(laserFactor, 5, 70, 1.5, "yellow", 0, 100);
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
                if (specialAttackType == 5) {
                    if (shooters[i] != player) {
                        enemyAI(player, shooters[i].bullets[j]);
                    }
                }
                if (shooters[i].color == "blue") {
                    shooters[i].bullets[j].draw("lightgreen");
                } else if (shooters[i].color == "red") {
                    shooters[i].bullets[j].draw("violet");
                } else if (shooters[i].color == "white") {
                    shooters[i].bullets[j].draw("orange");
                } else if (shooters[i].color == "yellow") {
                    shooters[i].bullets[j].draw("red");
                }
                shooters[i].bullets[j].move();
                for (var k = 0; k < shooters.length; k++) {
                    if (shooters[k] != shooters[i]) {
                        if (j < shooters[i].bullets.length) {
                            if (mode == 3 || mode == 2) {
                                if (shooters[k] != player) {
                                    enemyAI(shooters[k], shooters[i].bullets[j]);
                                }
                            }
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
            if (player.hp < maxHp) {
                player.hp = Math.floor(player.hp + regenRate);
                if (player.hp > maxHp) {
                    player.hp = maxHp;
                }
            }
            reload = fireRate;
        } else {
            reload--;
        }
        healthDisplay.innerHTML = "Health: " + Math.floor(player.hp).toString();
        if (player.hp >= 3 * maxHp / 4) {
            healthDisplay.style = "color: green;";
            ctx.fillStyle = "green";
            ctx.font = '48px comicsansms';
            ctx.fillText('Health: ' + Math.floor(player.hp).toString(), 0, 100);
        } else if (player.hp < 3 * maxHp / 4 && player.hp >= maxHp / 4) {
            healthDisplay.style = "color: orange;";
            ctx.fillStyle = "orange";
            ctx.font = '48px comicsansms';
            ctx.fillText('Health: ' + Math.floor(player.hp).toString(), 0, 100);
        } else {
            healthDisplay.style = "color: red;";
            ctx.fillStyle = "red";
            ctx.font = '48px comicsansms';
            ctx.fillText('Health: ' + Math.floor(player.hp).toString(), 0, 100);
        }
        waveDisplay.innerHTML = "Wave: " + (waveNum - 1).toString();
        ctx.fillStyle = "white";
        ctx.font = '48px comicsansms';
        ctx.fillText('Wave: ' +(waveNum - 1).toString(), 0, 200);
        
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
            pauseMusic();
            playGameOverSFX();
            clearInterval(gameLoop);
        }

        scoreDisplay.innerHTML = "Score: " + score.toString();
        highScoreDisplay.innerHTML = "High Score: " + getCookie("HighScore");

        time += 0.01;
        timeDisplay.innerHTML = "Time Spent Playing: " + Math.floor(time).toString() + " Seconds";

        if (winTime > 0) {
            ctx.fillStyle = "yellow"
            ctx.font = '48px comicsansms';
            ctx.fillText('You Completed Wave ' + (waveNum - 2).toString() + '!', canvas.width / 2, canvas.height / 2);
            winTime--;
            if (winTime == 1) {
                playWinSFX();
            }
        }
        for (var i = 0; i < specialAttackCooldownsOffset.length; i++) {
            if (specialAttackCooldowns[i] < specialAttackCooldownsOffset[i]) {
                specialAttackCooldowns[i] += 0.01;
            }
        }
    }
}

function startGame() {
    if (gameLoop) {
        clearInterval(gameLoop);
    }

    isPlaying = true;
    score = 0;
    regenRate = 1;
    maxHp = 90;
    waveNum = 1;
    laserNum = -2;
    laserFactor = 0;
    shooters = [];
    playerBulletRadius = 5;
    playerBulletSpeed = 3;
    playerBulletErrorRate = 0;
    movingUp = false;
    movingDown = false;
    movingLeft = false;
    movingRight = false;
    playerSpeed = 1;
    var specialAttackCooldowns = [2, 0.5, 1, 1, 0];
    var specialAttackCooldownsOffset = [2, 0.5, 1, 1, 0];//Add more special attacks in the future.
    map0 = [[1, 1], [10, 10]];
    maps = [map0];

    player.hp = 100;
    player.pos[0] = canvas.width / 2;
    player.pos[1] = canvas.height / 2;
    player.strength = 10;
    player.bullets = [];
    shooters.push(player);

    reload = 0;
    playMusic();

    gameLoop = setInterval(main, 10);
    start.innerHTML = "Restart Game";
}











































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































