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
        this.scale.forceOrientation(true, false);
        this.scale.enterIncorrectOrientation.add(this.handleIncorrect, this);
        this.scale.leaveIncorrectOrientation.add(this.handleCorrect, this);
    }

    create(){
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

        this.orientationBlocker = this.add.image(0, 0, 'orientation_bg');
        this.orientationBlocker.scale.setTo(1.4, 0.47);
        this.orientationBlocker.visible = false;

        this.playField.pushAnimalsDown();
    }

    update(){
        this.game.physics.arcade.collide(this.playField);
    }

    handleCorrect() {
        if (!this.game.device.desktop) {
            this.orientationBlocker.visible = false;
        }
    }

    handleIncorrect() {
        if (!this.game.device.desktop) {
            this.orientationBlocker.visible = true;
        }
    }

}
