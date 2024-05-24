import { _decorator, Button, Component, director, EditBox, instantiate, Label, Node, Prefab } from 'cc';
import { Singleton } from './gameManager/singleton';
import { levelSelectionScene , levelNumberBG , okButton, errorLabel } from './constants' ;

const { ccclass, property } = _decorator;

@ccclass('gameModeSelection')
export class gameModeSelection extends Component {



    @property( {type : Prefab} )
    errorPreabInModeSelection : Prefab | null = null ;

    @property( {type : EditBox } )
    usernameInput : EditBox | null = null ;

    @property( {type : EditBox } )
    livesInput : EditBox | null = null ;

    private errorText : string ;


    start() 
    {
        this.livesInput.node.on(EditBox.EventType.EDITING_DID_ENDED, this.takeLivesInput, this);
        this.usernameInput.node.on(EditBox.EventType.EDITING_DID_ENDED, this.takeUsernameInput , this);
        // for(let i=0; i<5 ; i++)
        // {
        //     // let prevLevel = Singleton.getInstance().setLevelScore(i , i , i*10) ;  
        //     Singleton.getInstance().setLevelScore(1 , i , i*10) ;  
        //     // console.log( ' mode  prevlevel ' , prevLevel ) ;
        // }
    }

    takeUsernameInput()
    {
        if( this.usernameInput.string.length == 0 )  
        {
            this.errorText = "Please enter the valid number " ;
            return  ;
        }
        if( this.usernameInput.string.length > 15 )  
        {
            this.errorText ="username should not have more than 15 characters " ;
            return  ;
        }
        // console.log( "username " , this.usernameInput.string  ) ;
        Singleton.getInstance().username = this.usernameInput.string ;
    }


    takeLivesInput()
    {
        if( isNaN( parseInt(this.livesInput.string) ) || parseInt(this.livesInput.string) == 0  )
        {
            this.errorText = "Please enter the valid number " ;
            this.generateErrorDialog(this.errorText)
            return ;
        }
        else if( parseInt(this.livesInput.string) > 10 ) 
        {
            this.errorText = "Please enter no less than or equal to 10 " ;
            this.generateErrorDialog(this.errorText)
            return ;
        }
        // console.log( parseInt(this.livesInput.string) ) ;
        Singleton.getInstance().totalLives = parseInt(this.livesInput.string) ;
    }

    generateErrorDialog( errorMessage : string  )
    {
        let errorPrefab = instantiate(this.errorPreabInModeSelection) ;
        let errorLabelComponent = errorPrefab.getChildByName(errorLabel).getComponent(Label) ;
        errorLabelComponent.string = errorMessage ;
        let okButtomChild = errorPrefab.getChildByName(okButton) ;
        this.node.addChild(errorPrefab) ;
        okButtomChild.on(Button.EventType.CLICK, () => { errorPrefab.destroy() }, this );
    }

    selectGameMode( event:Event , customEventData:string )
    {
        if( isNaN( parseInt(this.livesInput.string) ) || parseInt(this.livesInput.string) == 0 )  
        {
            // console.log( "Please enter the valid number " ) ;
            return  ;
        }
        
        // console.log( "select game mode ", customEventData ) ;
        Singleton.getInstance().gameMode = parseInt(customEventData) ;
        director.loadScene(levelSelectionScene)
    } 

    update(deltaTime: number) {
        
    }
}

