import 'pixi';
import 'p2';
import Phaser from 'phaser';
import style from '../styles/styles.js';
import config from '../config/configurations';


export default class extends Phaser.State {
    init() {

    }
    preload(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.forceOrientation(true, false);
        this.scale.enterIncorrectOrientation.add(this.handleIncorrect, this);
        this.scale.leaveIncorrectOrientation.add(this.handleCorrect, this);
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    }
    create(){

        let bg = this.add.image(0,0,'bg');
        bg.scale.setTo(config.lobbyBgScale);

        let gameName = this.add.text(this.world.centerX, config.lobbyNameY, 'Save the Animal', style.game_logo);
        gameName.anchor.setTo(0.5, 0.5);

        let playButton = this.add.text(this.world.centerX,config.lobbyPlayY,'Play',style.preload_txt);
        playButton.anchor.setTo(config.halfScale);
        playButton.inputEnabled = true;

        playButton.events.onInputDown.add(()=>{
            this.state.start('Game');
        }, this);

        this.orientationBlocker = this.add.image(0, 0, 'orientation_bg');
        this.orientationBlocker.scale.setTo(1.4,0.47);
        this.orientationBlocker.visible = false;


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
