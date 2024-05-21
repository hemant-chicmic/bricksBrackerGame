import { _decorator, Component, director, EditBox, Node } from 'cc';
import { Singleton } from './gameManager/singleton';
import { gamePlayScene } from './constants' ;

const { ccclass, property } = _decorator;

@ccclass('gameModeSelection')
export class gameModeSelection extends Component {

    @property( {type : EditBox } )
    livesInput : EditBox | null = null ;




    start() 
    {
        this.livesInput.node.on(EditBox.EventType.EDITING_DID_ENDED, this.takeLivesInput, this);
    }

    takeLivesInput()
    {
        if( isNaN( parseInt(this.livesInput.string) ) || parseInt(this.livesInput.string) == 0 )  
        {
            console.log( "Please enter the valid number " ) ;
            return  ;
        }
        console.log( parseInt(this.livesInput.string) ) ;
        Singleton.getInstance().totalLives = parseInt(this.livesInput.string) ;
    }

    selectGameMode( event:Event , customEventData:string )
    {
        if( isNaN( parseInt(this.livesInput.string) ) || parseInt(this.livesInput.string) == 0 )  
        {
            console.log( "Please enter the valid number " ) ;
            return  ;
        }
        
        console.log( "select game mode ", customEventData ) ;
        Singleton.getInstance().gameMode = parseInt(customEventData) ;
        director.loadScene(gamePlayScene)
    } 

    update(deltaTime: number) {
        
    }
}

