var canvas = document.getElementById("canvas");//Canvas
var ctx = canvas.getContext("2d");//Context

var width = 1000;
var height = 600;

canvas.width = width;//Set Canvas size
canvas.height = height;//Set Canvas size

var bullets = [];//bullets list
var shooters = [];//enemies list

class Bullet {
    constructor(posX, posY, width, height, velocityX, velocityY, strength) {
        this.pos = [posX, posY];//Bullet position
        this.velocity = [velocityX, velocityY];
        this.size = [width, length];//Size
        this.strength = strength; //Bullet attack strength
    }

    move() {
        //Update position with velocity
        if (this.pos[0] < 0 || this.pos[0] > width || this.pos[1] < 0 || this.pos[1] > height) {
            //this = null;//SELF DESTRUCT
        }
        this.pos[0] += this.velocity[0];//moveX
        this.pos[1] += this.velocity[1];//moveY
    }

    checkIfHit(shooter) {
        //checks if hit
        if (this.pos[0] > shooter.pos[0] && this.pos[0] < (shooter.pos[0] + shooter.size[0]) && this.pos[1] > shooter.pos[1] && this.pos[1] < (shooter.pos[1] + shooter.size[1])) {
            shooter.hp -= this.damage;//take damage when hit
        }
    }
}

class Shooter {
    constructor(posX, posY, width, height, hp, strength) {
        this.pos = [posX, posY];//Shooter position
        this.size = [width, length];//Size
        this.hp = hp;//Shooter hp
        this.strength = strength;//Shooter attack strength
        this.direction = 0;//Direction
    }

    aim(aimX, aimY) {
        //Looks at a certain position
        this.direction = (180 - Math.asin(Math.sqrt(Math.pow(Math.abs(aimX - this.pos[0]), 2) + Math.pow(Math.abs(aimY - this.pos[1], 2))) / Math.abs(y1 - y0))) * Math.PI / 180; //big ol pointer
    }

    shoot(shootX, shootY, bulletWidth, bulletHeight) {
        //Fire in the direction of shootX and shootY
        this.aim(shootX, shootY); //aim at enemy
        let bullet = new Bullet(this.pos[0], this.pos[1], bulletWidth, bulletHeight)//bullet creating
    }

    update() {
        //Movement AI and Check if ded
    }

    draw() {
        //Draw the Shooter
    }
}