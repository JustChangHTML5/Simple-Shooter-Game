var canvas = document.getElementById("canvas");//Canvas
var ctx = canvas.getContext("2d");//Context

var width = 1000;
var height = 600;

canvas.width = width;//Set Canvas size
canvas.height = height;//Set Canvas size

class Bullet {
    constructor(posX, posY, width, height, velocityX, velocityY, strength) {
        this.pos = [posX, posY];//Bullet position
        this.velocity = [velocityX, velocityY];
        this.size = [width, length];//Size
        this.strength = strength; //Bullet attack strength
    }

    move() {
        this.pos[0] += this.velocity[0];
        this.pos[1] += this.velocity[1];
    }

    checkIfHit(shooter) {
        if (this.pos[0] > shooter.pos[0] && this.pos[0] < (shooter.pos[0] + shooter.size[0]) && this.pos[1] > shooter.pos[1] && this.pos[1] < (shooter.pos[1] + shooter.size[1]) {
            shooter.hp -= this.damage;
        }
    }

}

class Shooter {
    constructor(posX, posY, width, height, hp, strength) {
        this.pos = [posX, posY];//Shooter position
        this.size = [width, length];//Size
        this.hp = hp;//Shooter hp
        this.strength = strength;//Shooter attack strength
    }

    aim(aimX, aimY) {
        //Looks at a certain position
    }

    shoot(shootX, shootY) {
        //Fire in the direction of shootX and shootY
    }

    update() {
        //Movement AI and Check if ded
    }

    draw() {
        //Draw the Shooter
    }
}