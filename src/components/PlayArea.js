import Phaser from 'phaser';
const EventEmitter = require('events');
import Animal from './Animal.js';
import config from '../config/configurations';
import style from '../styles/styles.js';

export default class PlayArea extends Phaser.Group {

    constructor(game, name) {
        super(game, game.world, name, false, true);
        this.game = game;
        this.events = new EventEmitter();
        this.animals = config.animal_names;
        this.gameEnd = false;
        this.pushInProgress = false;
        this.minSpeed = config.minVelocity;
        this.speed = this.minSpeed;
        this.fallenAnimals = [];
        this.createGraphics();
        this.nextAnimal = this.nextAnimalToPush();
    }

    createGraphics(){
        let gameBg = this.game.make.image(0,0,'game_bg');
        this.add(gameBg);
    }

    pushAnimalsDown(){
        let create = this.createAnimal(this.nextAnimal);
        this.nextAnimal = this.nextAnimalToPush();
        this.events.emit('next-animal',this.nextAnimal);
        if(!create){
            this.endGame();
        }else{
            this.pushInProgress = false;
        }
    }

    nextAnimalToPush(){
        let index = Math.floor(Math.random() * this.animals.length);
        let animalName = this.animals[index];
        return animalName;
    }

    createAnimal(name){

        let animal = new Animal(this.game, config.fallingAnimal.x, config.fallingAnimal.y, 'animal','animal_'+name+'.png');
        this.add(animal);

        for(let i=0;i<this.fallenAnimals.length;i++){
            if(this.fallenAnimals[i].alive){
                this.gameEnd = this.checkOverlap(animal, this.fallenAnimals[i]);
                if(this.gameEnd){
                    break;
                }
            }
        }
        if(this.gameEnd){
            this.remove(animal);
            return;
        }
        this.fallenAnimals.push(animal);
        animal.body.collideWorldBounds = true;
        animal.body.gravity.y = this.speed;
        animal.body.bounce.setTo(0,0);
        animal.body.onCollide = new Phaser.Signal();
        animal.body.onCollide.add(this.hitSprite, this);
        animal.body.onWorldBounds = new Phaser.Signal();
        animal.body.onWorldBounds.add(this.onWorldHit, this);
        return true;
    }

    hitSprite(animal1,animal2){

        if ((!animal1.collided || !animal2.collided) && !this.pushInProgress) {
            this.pushInProgress = true;
            if(!animal1.collided){
                animal1.collided = true;
            }
            if(!animal2.collided){
                animal2.collided = true;
            }

            animal1.body.onCollide.dispose();
            animal2.body.onCollide.dispose();
            animal1.body.onWorldBounds.dispose();
            animal2.body.onWorldBounds.dispose();
            animal1.inputEnabled = false;
            animal2.inputEnabled = false;
            if (animal1.name === animal2.name) {
                animal1.destroy();
                animal2.destroy();
                this.updateScore();
            }
            this.pushAnimalsDown();
        }

    }

    onWorldHit(animal, up, down, left, right) {
        if (down && !animal.collided){
            animal.body.onWorldBounds.dispose();
            animal.body.onCollide.dispose();
            animal.collided = true;
            animal.inputEnabled = false;
            animal.body.gravity.y=0;
            this.pushAnimalsDown();
        }
    }

    updateScore(){
        this.events.emit('update-score');
    }

    checkOverlap(animal1, animal2) {
        let boundsA = animal1.getBounds();
        let boundsB = animal2.getBounds();
        return Phaser.Rectangle.intersects(boundsA, boundsB);
    }

    updateAnimalSpeed(speed){

        this.speed = this.minSpeed * speed;
        let currentAnimal = this.fallenAnimals[this.fallenAnimals.length - 1];
        if(!currentAnimal.collided){
            currentAnimal.body.velocity.y = this.speed;
        }

    }

    endGame(){
        let gameEndLabel = this.game.make.text((config.playAreaWidth / 2), (config.playAreaHeight / 2),config.gameEndText,style.game_end_text);

        gameEndLabel.anchor.setTo(config.halfScale);

        this.add(gameEndLabel);
    }
}
