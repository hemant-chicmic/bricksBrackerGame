import { _decorator, Button, Component, director, Node } from 'cc';
import { Singleton } from './gameManager/singleton';
import { lockImage , gamePlayScene , levelNumberBG } from './constants' ;



const { ccclass, property } = _decorator;

@ccclass('levelSelection')
export class levelSelection extends Component {



    @property({ type: Node })
    allLevels: Node | null = null;


    clickLevels( event: Event, customEventData: string )
    {
        console.log( " clikced levels " , customEventData )
        Singleton.getInstance().clickLevel = parseInt(customEventData) ;
        director.loadScene(gamePlayScene) ;
    }



    start() 
    {
        let totalLevels = this.allLevels.children.length ;
        for(let i=1; i<totalLevels ; i++)
        {
            let prevLevel = Singleton.getInstance().levelScore[i-1] ; 
            console.log( 'prevlevel ' , prevLevel ,  i-1 ) ;
            this.openLevel( i , prevLevel==1 ? true : false )  ;
        }
    }

    openLevel( levelInd : number , flag : boolean )
    {
        console.log( levelInd , flag ) ;
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

