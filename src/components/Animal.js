import Phaser from 'phaser'
import config from '../config/configurations'

export default class Animal extends Phaser.Sprite {
    constructor(game, x, y, asset, animal) {
        super(game, x, y, asset, animal)
        this.anchor.setTo(config.halfScale);
        this.scale.setTo(2);
        this.name = animal.split('_')[1];
        this.collided = false;
        this.outOfBoundsKill = true;
        this.inputEnabled = true;
        this.createKey();
    }

    createKey(){
        this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    }

    update() {
        if(this.inputEnabled){
            if (this.upKey.isDown) {
                this.angle += config.animalRotation;
            }
            else if (this.downKey.isDown) {
                this.angle -= config.animalRotation;
            }

            if (this.leftKey.isDown) {
                this.x -= config.animalMove;
            }
            else if (this.rightKey.isDown) {
                this.x += config.animalMove;
            }
        }
    }
}
