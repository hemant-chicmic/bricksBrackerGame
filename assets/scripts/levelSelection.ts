import { _decorator, Button, Component, director, Label, Node, Prefab } from 'cc';
import { Singleton } from './gameManager/singleton';
import { lockImage , gameModeSelectionScene ,  gamePlayScene , levelNumberBG } from './constants' ;
import { setUserData , getUserData , updateScore } from './ScoreManagerLocalStorage' ;



const { ccclass, property } = _decorator;

@ccclass('levelSelection')
export class levelSelection extends Component {



    @property( {type : Label} )
    usernameID : Label | null = null ;

    @property({ type: Node })
    allLevels: Node | null = null;


    private totalLevels : any ; 
    private userData : any ; 
    private gameModeIndex : number = 0 ;

    clickLevels( event: Event, clickLevelIndex: string )
    {
        // console.log( " clikced levels " , customEventData )
        Singleton.getInstance().clickLevel = parseInt(clickLevelIndex) ;
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
            
            const gameData = this.userData[this.usernameID.string ].gameData;
            let lastLevel = gameData[this.gameModeIndex].length ;
            let score = gameData[this.gameModeIndex][lastLevel-1] ;
            Singleton.getInstance().clickLevel = score > 0 ? lastLevel%this.totalLevels : lastLevel-1  ;
            // Singleton.getInstance().clickLevel = lastLevel-1  ;
            // console.log( "lastleev " , lastLevel-1 ) ;
            director.loadScene(gamePlayScene) ;
        }
    }




    
    start() 
    {
        // console.log( " levelSeelction start function " )
        // if( Singleton.getInstance().username )  this.usernameID.string = Singleton.getInstance().username ;
        // if( Singleton.getInstance().gameMode )  this.gameModeIndex = Singleton.getInstance().gameMode ;
        this.gameModeIndex = Singleton.getInstance().gameMode ;
        this.userData = getUserData();
        const username = Object.keys(this.userData)[0]; 
        if ( !username ) return ;
        this.usernameID.string = username  ;

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

        // console.log( "gameModeIndex " , this.gameModeIndex)
        const gameData = this.userData[this.usernameID.string].gameData;
        // console.log( gameData[this.gameModeIndex][0]  )
        // for(let i=1; i<=gameData[this.gameModeIndex-1].length ; i++)
        // {
        //     let prevLevel = gameData[this.gameModeIndex-1][i-1] ;  
        //     console.log( ' level-prevlevel   ' , prevLevel , "game mode " , this.gameModeIndex-1, 'level ' , i-1  ) ;
        //     if( ! prevLevel ) break ;
        //     this.openLevel( i , prevLevel > 0 ? true : false )  ;
        // }
        // console.log( this.gameModeIndex , gameData ) ;
        this.totalLevels = this.allLevels.children.length ;
        Singleton.getInstance().totalLevel = this.totalLevels ;
        for(let i=1; i<this.totalLevels ; i++)
        {
            let prevLevel = gameData[this.gameModeIndex][i-1] ;  
            // console.log( ' level-prevlevel   ' , prevLevel , "game mode " , this.gameModeIndex, 'level ' , i-1  ) ;
            this.openLevel( i , prevLevel > 0 ? true : false )  ;
        }
        
    }

    // openLevel( levelInd : number , flag : boolean )
    // {
    //     let totalLevels = this.allLevels.children.length ;
    //     if( levelInd >= totalLevels ) return ;
    //     // console.log( levelInd , flag ) ;
    //     let level = this.allLevels.children[levelInd] ;
    //     let levelNumberBGImg = level.getChildByName(levelNumberBG) ;    
    //     let levelNumberBGImgButton = levelNumberBGImg.getComponent(Button) ;
    //     levelNumberBGImgButton.interactable = flag ; 
    //     let levelLockImag = level.getChildByName(lockImage) ;    
    //     levelLockImag.active = !flag ;
    // }
    
    
    openLevel( levelInd : number , flag : boolean )
    {
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

