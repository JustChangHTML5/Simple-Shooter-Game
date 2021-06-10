var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width = 1000;
var height = 600;

canvas.width = width;
canvas.height = height;

var bullets = [];
var smallShooters = [];
var bigShooters = [];
var movingShooters = [];
var shooters = [smallShooters, bigShooters, movingShooters];

function drawRect(x, y, width, height, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.stroke();
}

function rotateAtPoint(x, y, angle) {
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.translate(x * -1, y * -1);
}

class Bullet {
    constructor(posX, posY, width, height, velocityX, velocityY, strength) {
        this.pos = [posX, posY];
        this.velocity = [velocityX, velocityY];
        this.size = [width, length];
        this.strength = strength;
    }

    move() {
        if (this.pos[0] < 0 || this.pos[0] > width || this.pos[1] < 0 || this.pos[1] > height) {
            //SELF DESTRUCT
        }
        this.pos[0] += this.velocity[0];
        this.pos[1] += this.velocity[1];
    }

    checkIfHit(shooter) {
        if (this.pos[0] > shooter.pos[0] && this.pos[0] < (shooter.pos[0] + shooter.size[0]) && this.pos[1] > shooter.pos[1] && this.pos[1] < (shooter.pos[1] + shooter.size[1])) {
            shooter.hp -= this.damage;
        }
    }
}

class Shooter {
    constructor(posX, posY, width, height, hp, strength, color) {
        this.pos = [posX, posY];
        this.size = [width, length];
        this.hp = hp;
        this.strength = strength;
        this.direction = 0;
        this.color = color;
    }

    aim(aimX, aimY) {
        this.direction = (180 - Math.asin(Math.sqrt(Math.pow(Math.abs(aimX - this.pos[0]), 2) + Math.pow(Math.abs(aimY - this.pos[1], 2))) / Math.abs(y1 - y0))) * Math.PI / 180;
    }

    shoot(shootX, shootY, bulletWidth, bulletHeight) {
        this.aim(shootX, shootY);
        let bullet = new Bullet(this.pos[0], this.pos[1], bulletWidth, bulletHeight);
    }

    update() {
        if (this.hp <= 0) {
            //SELF DESTRUCT
        }
    }

    draw() {
        rotateAtPoint(this.pos[0], this.pos[1], this.direction);
        drawRect(this.pos[0] - (this.height / 2), this.pos[1] - (this.height / 2), this.width, this.height, this.color);
    }
}