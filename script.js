var canvas = document.getElementById("canvas");//Canvas
var ctx = canvas.getContext("2d");//Context

canvas.width = 100;//Set Canvas size
canvas.height = 100;//Set Canvas size

class Shooter {
    constructor(posX, posY, width, height, hp, strength) {
        this.pos = #[posX, posY];//Shooter position
        this.size = #[width, length];//Size
        this.hp = hp;//Shooter hp
        this.strength = strength;//Shooter attack strength
    }

    aim(aimX, aimY) {
        //Looks at a certain position
    }

    shoot(shootX, shootY) {
        //Fire in the direction of shootX and shootY
    }

    move() {
        //Movement AI
    }

    draw() {
        //Draw the Shooter
    }
}