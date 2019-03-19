import 'pixi';
import 'p2';
import Phaser from 'phaser';

import PlayArea from '../components/PlayArea.js';
import DashBoard from '../components/DashBoard.js';
import config from '../config/configurations';

export default class extends Phaser.State {

    init(){

    }

    preload(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    }

    create(){
        this.forceSingleUpdate = true;
        this.time.advancedTiming = true;
        this.stage.disableVisibilityChange = true;
        this.input.maxPointers = 1;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.setBounds(0, 0, config.playAreaWidth, config.playAreaHeight);

        this.playField = new PlayArea(this.game,'play-area');
        this.game.world.bringToTop(this.playField);
        this.game.physics.arcade.enable(this.playField);

        this.dashBoard = new DashBoard(this.game,'score-board');
        this.playField.events.on('update-score', () => {
            this.dashBoard.updateScore();
        });

        this.playField.events.on('next-animal',(name)=>{
            this.dashBoard.updateNextAnimal(name);
        });

        this.dashBoard.events.on('speed-update',(speed)=>{
            this.playField.updateAnimalSpeed(speed);
        })

        this.playField.pushAnimalsDown();
    }

    update(){
        this.game.physics.arcade.collide(this.playField);
    }

    render(){

    }

}
