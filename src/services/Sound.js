export default class Sound {
    constructor(game,list){
        this.audio={};
        list = list || ['chip_sel'] ;
        for(let i=0;i<list.length;i++){
            this.audio[list[i]] = game.add.audio(list[i]);
        }
    }

    play(name,loop){
        if(!loop)
            this.audio[name].play();
        else
            this.audio[name].play('',0,1,true);
    }

    stop(name){
        if(this.audio[name].isPlaying)
            this.audio[name].stop();
    }
}
