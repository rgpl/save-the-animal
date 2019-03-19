import Phaser from 'phaser';

import fullScreen from '../services/fullscreen';
import assets from '../config/asset';
import style from '../styles/styles';
import config from '../config/configurations';

export default class extends Phaser.State {

    init(){

    }

    preload(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    }

    create(){

        this.progressTxt = this.add.text(this.game.world.centerX,(config.gameHeight / 2),'0%',style.preload_txt);
        this.progressTxt.anchor.setTo(config.halfScale);

        this.load.onLoadStart.add(this.loadStart, this);
        this.load.onFileComplete.add(this.fileComplete, this);
        this.load.onLoadComplete.add(this.loadComplete, this);

        this.load.image("bg", assets["bg"]);
        this.load.image("game_bg", assets["game_bg"]);
        this.load.image("menu", assets["menu"]);
        this.load.image("button_plus", assets["button_plus"]);
        this.load.image("button_minus", assets["button_minus"]);
        this.load.image("dashboard_bg", assets["dashboard_bg"]);
        this.load.atlasJSONHash("animal",assets["animal"].image,null,assets["animal"].data);


        this.load.resetLocked = true;

        this.load.start();

    }

    loadStart(){

    }

    fileComplete(progress, cacheKey, success, totalLoaded, totalFiles){
        this.progressTxt.text = progress + "%";
    }

    loadComplete(){
        document.getElementById('connector').style.display = "none";
        this.state.start('Lobby');
    }

    handleCorrect(){
        if(!this.game.device.desktop){
            document.getElementById("land_scape").style.display="none";
        }
    }

    handleIncorrect(){
        if(!this.game.device.desktop){
            document.getElementById("land_scape").style.display="block";
        }
    }

    gofull(){
        if(!this.game.device.desktop){
            fullScreen();
        }
    }
}
