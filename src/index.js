import 'pixi';
import 'p2';
import Phaser from 'phaser';

import Preload from './states/Preload';
import Lobby from './states/Lobby';
import Game from './states/Game';
import config from './config/configurations';

class App extends Phaser.Game {
    constructor(){
        super(config.gameWidth,config.gameHeight,Phaser.CANVAS,'content',null,true);

        this.state.add('Preload', Preload, false);
        this.state.add('Lobby',Lobby,false);
        this.state.add('Game',Game,false);

        this.state.start('Preload');
    }
}

window.game = new App();
