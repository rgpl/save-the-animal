import Phaser from 'phaser';
const EventEmitter = require('events');
import style from '../styles/styles.js';
import config from '../config/configurations';

export default class DashBoard extends Phaser.Group{

    constructor(game, name){

        super(game,game.world,name);
        this.events = new EventEmitter();
        this.currentScore = 0;
        this.speed = config.speed;
        this.maxSpeed = config.maxSpeed;
        this.createBoard();
    }

    createBoard(){
        let dashboardBg = this.game.make.image(config.dashBoardX,0,"dashboard_bg");

        let gameName = this.game.make.text(config.dbNameX, config.dbNameY, config.gameName, style.game_name);

        let scoreLabel = this.game.make.text(config.dbNameX, config.scoreLabelY, config.scoreLabel,style.score_label);

        let scoreHolder = new Phaser.Rectangle(config.scoreHolder.x, config.scoreHolder.y, config.scoreHolder.w, config.scoreHolder.h);

        let scoreGraphics = this.game.make.graphics(scoreHolder.x, scoreHolder.y);
        scoreGraphics.beginFill(config.scoreHolderColor);

        scoreGraphics.drawRect(0, 0, scoreHolder.width, scoreHolder.height);

        this.score = this.game.make.text(0,config.scoreValY,'00',style.score_value);
        this.score.setTextBounds(scoreHolder.x, scoreHolder.y, scoreHolder.width, scoreHolder.height);
        this.score.boundsAlignH = 'center';
        this.score.boundsAlignV = 'center';

        let nextImageLabel = this.game.make.text(config.nextImgX, config.nextImgY, config.nextAnimalText, style.score_label);

        let speedLabel = this.game.make.text( config.dbNameX, config.speedLabelY,config.speedLabelText, style.speed_label);

        speedLabel.name = "speed_label";

        let speedValue = this.game.make.text(config.speedVal.x, config.speedVal.y, ''+this.speed, style.speed_value);
        speedValue.name = "speed_value";

        let incrementor = this.game.make.image(config.buttonPlusX,config.buttonPlusY,'button_plus');
        incrementor.inputEnabled = true;
        incrementor.scale.setTo(0.8);
        incrementor.events.onInputDown.add(()=>{
            this.configureSpeed(true);
        },this)

        let decrementor = this.game.make.image(config.buttonPlusX, config.buttonMinusY, 'button_minus');
        decrementor.inputEnabled = true;
        decrementor.scale.setTo(config.buttonScale);
        decrementor.events.onInputDown.add(() => {
            this.configureSpeed(false);
        }, this);

        this.addMultiple([dashboardBg, gameName, scoreLabel, scoreGraphics, this.score, nextImageLabel, speedLabel, speedValue, incrementor, decrementor]);
    }

    updateScore(){
        this.currentScore += config.scoreMultiplier;
        this.score.text = this.currentScore;
    }

    configureSpeed(flag){
        if(flag){
            if(this.speed < this.maxSpeed){
                this.speed++;
                this.updateSpeed(this.speed);
            }
        }else{
            if((this.speed-1)){
                this.speed--;
                this.updateSpeed(this.speed);
            }
        }
    }

    updateSpeed(speed){
        this.getByName('speed_value').text = speed;
        this.events.emit('speed-update',speed);
    }

    updateNextAnimal(name){
        if(!this.nextAnimal){
            this.nextAnimal = this.game.make.image(config.nxtAnimalX, config.nxtAnimalY, 'animal', 'animal_' + name + '.png');
            this.add(this.nextAnimal);
        }else{
            this.nextAnimal.loadTexture('animal','animal_'+name+'.png');
        }
    }

}
