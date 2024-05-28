import { _decorator, Button, Component, director, Label, Node, Prefab } from 'cc';
import { Singleton } from './gameManager/singleton';
import { lockImage , gameModeSelectionScene ,  gamePlayScene , levelNumberBG } from './constants' ;
import { setUserData , getUserData , updateScore , getUserGameData , setUserLoginStatus , getUserLoginStatus } from './ScoreManagerLocalStorage' ;



const { ccclass, property } = _decorator;

@ccclass('levelSelection')
export class levelSelection extends Component {



    @property( {type : Label} )
    usernameID : Label | null = null ;

    @property({ type: Node })
    allLevels: Node | null = null;


    private gameModeIndex : number = 0 ;


    clickLevels( event: Event, customEventData: string )
    {
        // console.log( " clikced levels " , customEventData )
        Singleton.getInstance().clickLevel = parseInt(customEventData) ;
        director.loadScene(gamePlayScene) ;
    }


    sceneChange( event : Event , customEventData : string )
    {
        if( parseInt(customEventData) == 1 ) director.loadScene(gameModeSelectionScene) ;
        else if( parseInt(customEventData) == 2 )
        {
            // let totalLevels = this.allLevels.children.length ;
            // let i = 0 ;
            // for( i=0; i<totalLevels ; i++)
            // {
            //     let prevLevel = Singleton.getInstance().getLevelScore(this.gameModeIndex , i-1 ) ;  
            //     if( prevLevel == 0 )  break ; 
            // }
            // Singleton.getInstance().clickLevel = i-1 ;
            // director.loadScene(gamePlayScene) ;
            
            const userData = getUserData();
            const gameData = userData[this.usernameID.string ].gameData;
            let lastLevel = gameData[this.gameModeIndex-1].length ;
            let score = gameData[this.gameModeIndex-1][lastLevel-1] ;
            Singleton.getInstance().clickLevel = score > 0 ? lastLevel : lastLevel-1  ;
            director.loadScene(gamePlayScene) ;
        }
    }




    
    start() 
    {
        console.log( " levelSeelction start function " )
        // if( Singleton.getInstance().username )  this.usernameID.string = Singleton.getInstance().username ;
        // if( Singleton.getInstance().gameMode )  this.gameModeIndex = Singleton.getInstance().gameMode ;
        this.usernameID.string = Singleton.getInstance().username ;
        this.gameModeIndex = Singleton.getInstance().gameMode ;

        // console.log('game mde ' ,  this.gameModeIndex  ) ;
        // Singleton.getInstance().totalLevel = this.allLevels.children.length ;
        // let totalLevels = this.allLevels.children.length ;
        // for(let i=0; i<5 ; i++)
        // {
        //     let prevLevel = Singleton.getInstance().getLevelScore(this.gameModeIndex , i ) ;  
        //    console.log( ' level  prevlevel ' , prevLevel  ) ;
        // }
        // for(let i=1; i<totalLevels ; i++)
        // {
        //     let prevLevel = Singleton.getInstance().getLevelScore(this.gameModeIndex , i-1 ) ;  
        //     // console.log( ' level-prevlevel   ' , prevLevel , "game mode " , this.gameModeIndex ) ;
        //     this.openLevel( i , prevLevel > 0 ? true : false )  ;
        // }




        const userData = getUserData();
        console.log( ' userData   ' , userData ) ;
        if (!userData ) return ;
        console.log( ' this.usernameID.string   ' , this.usernameID.string ,  " usernameDate" , userData[this.usernameID.string] ) ;
        if (!userData[this.usernameID.string]) return ;
        const gameData = userData[this.usernameID.string].gameData;
        console.log( ' gameData   ' , gameData , "game mode " , this.gameModeIndex-1, 'length ' , gameData[this.gameModeIndex-1].length ) ;
        for(let i=1; i<=gameData[this.gameModeIndex-1].length ; i++)
        {
            let prevLevel = gameData[this.gameModeIndex-1][i-1] ;  
            console.log( ' level-prevlevel   ' , prevLevel , "game mode " , this.gameModeIndex-1, 'level ' , i-1  ) ;
            if( ! prevLevel ) break ;
            this.openLevel( i , prevLevel > 0 ? true : false )  ;
            
        }
    }

    openLevel( levelInd : number , flag : boolean )
    {
        let totalLevels = this.allLevels.children.length ;
        if( levelInd >= totalLevels ) return ;
        // console.log( levelInd , flag ) ;
        let level = this.allLevels.children[levelInd] ;
        let levelNumberBGImg = level.getChildByName(levelNumberBG) ;    
        let levelNumberBGImgButton = levelNumberBGImg.getComponent(Button) ;
        levelNumberBGImgButton.interactable = flag ; 
        let levelLockImag = level.getChildByName(lockImage) ;    
        levelLockImag.active = !flag ;
    }

    update(deltaTime: number) {
        
    }
}

