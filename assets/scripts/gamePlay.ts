import { _decorator, AudioSource, BoxCollider2D, Button, Collider2D, Color, Component, Contact2DType, director, EventMouse, instantiate, Intersection2D, Label, Layout, Node, PhysicsSystem2D, Prefab, randomRangeInt, RigidBody2D, sp, Sprite, tween, Tween, UITransform, Vec2, Vec3 } from 'cc';
import { gamePlayScene , levelSelectionScene , countdownLabelFontSize, gameModeSelectionScene , winningLabel , playNextGame } from './constants' ;
import { Singleton } from './gameManager/singleton';
import { brickPatternDesigns } from './bricksPatterns';
import { switchButton } from './Utility';


const { ccclass, property } = _decorator;

@ccclass('gamePlay')
export class gamePlay extends Component {


    @property( {type : Label} )
    usernameID : Label | null = null ;

    @property( {type :AudioSource } )
    bgMusic : AudioSource | null = null ;

    @property({ type: Node })
    allBricks: Node | null = null;
    @property({ type: Prefab })
    rowBrickPrefab: Prefab | null = null;
    @property({ type: Prefab })
    singleBrickPrefab: Prefab | null = null;

    @property({ type: Node })
    leftWall: Node | null = null;
    @property({ type: Node })
    rightWall: Node | null = null;
    @property({ type: Node })
    bottomWall: Node | null = null;
    
    @property({ type: Node })
    bgImage: Node | null = null;
    @property({ type: Node })
    ballImage: Node | null = null;
    @property({ type: Node })
    platformBase: Node | null = null;

    @property({ type: Node })
    extraBalls: Node | null = null;
    @property({ type: Prefab })
    extraBallsPrefab: Prefab | null = null;

    @property({ type: Label })
    countdownLabel: Label | null = null;

    // @property({ type: Label })
    // playerName: Label | null = null;
    @property({ type: Label })
    playerScore: Label | null = null;
    @property({ type: Prefab })
    winPrefab: Prefab | null = null;


    @property({ type: Node })
    pause_icon: Node | null = null;
    @property({ type: Node })
    play_icon: Node | null = null;

    @property({ type: Node })
    settingsImgButtom: Node | null = null;
    @property({ type: Node })
    OffAudio_icon: Node | null = null;
    @property({ type: Node })
    OnAudio_icon: Node | null = null;


    private ballInitialPosition : Vec3 = new Vec3(0,0,0) ;
    private platformInitialPosition : Vec3 = new Vec3(0,0,0) ;
    private remainingBalls : number = 0 ;
    private isAnimating : boolean = true ; 
    private score : number = 0 ; 
    private clickedLevel : number = 0 ;
    private gameMode : number = 1  ;
    private totalBricks :number = 0 ; 
    private totalLives : number = 3 ;
    private allColors = [
        { name: "Red", color: new Color(255, 0, 0) },
        { name: "Green", color: new Color(0, 255, 0) },
        { name: "Yellow", color: new Color(255, 255, 0) },
        { name: "Orange", color: new Color(255, 165, 0) }, 
    ];
    private isSettingOpens: boolean = true;
    private totalLevels : number = 0 ;
    private nextGame : string ;

    private startFirstTime : number = 1 ;
    


    startGameButton()
    {
        switchButton(this.play_icon, this.pause_icon, !this.play_icon.active);
        if( this.startFirstTime  ) this.startFirstTime = 0 , this.timerAnimation( 3 ) ;
        if( this.play_icon.active ) director.pause() ;
        else  director.resume() ;
        
    }
    
    settingsButtom()
    {
        this.isSettingOpens = this.isSettingOpens == false ? true : false ;
        let settingLayout = this.settingsImgButtom.getComponent(Layout);
        if ( this.isSettingOpens) 
        {
            this.scheduleOnce( () => {
                director.pause() ;
            } , 0 )
            settingLayout.type = Layout.Type.VERTICAL;
            settingLayout.verticalDirection = Layout.VerticalDirection.TOP_TO_BOTTOM;
            let spacing = 10;
            settingLayout.paddingTop = this.settingsImgButtom.height + spacing;
            settingLayout.spacingY = spacing;
            this.settingsImgButtom.children.forEach((child, index) => {
                child.active = true;
            });
            
        }
        else 
        {
            director.resume();
            settingLayout.type = Layout.Type.NONE;
            this.settingsImgButtom.children.forEach((child) => {
                child.setPosition(new Vec3(0, 0, 0));
                child.active = false;
            });
        }
    } 
    restartGame()
    {
        console.log("restart Game To levelSelectionScene");
        Tween.stopAll();
        director.loadScene(levelSelectionScene);
    }
    exitGame()
    {
        console.log("exit screen gameModeSelectionScene ");
        Tween.stopAll();
        director.loadScene(gameModeSelectionScene);
    }
    OnOffMusicButton() 
    {
        if (this.bgMusic.playing) this.bgMusic.pause();
        else this.bgMusic.play() ;
        switchButton(this.OnAudio_icon, this.OffAudio_icon, !this.OnAudio_icon.active);
    }



 
    

    start() 
    {
        console.log("start start start function");
        this.play_icon.active = true ;
        this.pause_icon.active = false ;
        this.settingsButtom()  ;
        this.bgMusic.play() ;
        if( Singleton.getInstance().username )  this.usernameID.string = Singleton.getInstance().username ;
        if( Singleton.getInstance().gameMode ) this.gameMode = Singleton.getInstance().gameMode ;
        if( Singleton.getInstance().totalLives ) this.totalLives = Singleton.getInstance().totalLives ;
        if( Singleton.getInstance().clickLevel ) this.clickedLevel = Singleton.getInstance().clickLevel ;
        if( Singleton.getInstance().totalLevel  ) this.totalLevels = Singleton.getInstance().totalLevel  ;
        console.log( "game mode  " , this.gameMode , "total lives " , this.totalLives ) ;
        for(let i=0; i<this.totalLives; i++)
        {
            this.extraBalls.addChild(instantiate(this.extraBallsPrefab)) ;
        }
        
        this.remainingBalls = this.extraBalls.children.length ;
        this.ballInitialPosition = this.ballImage.getPosition() ;
        this.platformInitialPosition = this.platformBase.getPosition() ; 
        this.node.on( Node.EventType.MOUSE_MOVE , this.onMouseMove  , this  ) ;
        let ballCollider = this.ballImage.getComponent(Collider2D);
        ballCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

        this.generateBricksPattern() ;

        this.ballImage.getComponent(Sprite).color = new Color(255, 0, 0)   ; // red
        // this.ballImage.getComponent(Sprite).color = new Color(0, 255, 0)    ;  // green
        // this.ballImage.getComponent(Sprite).color = new Color(255, 255, 0)   ; // yellow
        // this.ballImage.getComponent(Sprite).color = new Color(255, 165, 0)   ; // orange
    }

    onMouseMove(event : EventMouse )
    {
        // console.log( " mouse " , this.isAnimating ) ;
        if( this.isAnimating ) return ;
        let mousePosition = event.getUILocation() ; // // this mouse position is already in the world postion 
        let bgImagePosition = this.bgImage.getPosition() ;
        let mousePositionToPlateFormParent = this.platformBase.parent.getComponent(UITransform).convertToNodeSpaceAR( new Vec3( mousePosition.x , mousePosition.y  , 0 )) ;
        // console.log( " mousePositionBGImage " , mousePositionToPlateFormParent ) ;
        let platformBasePosition =  this.platformBase.getPosition() ; // /// this plateform position is w.r.t its parent
        let newPositionPlatformBase =  new Vec3( mousePositionToPlateFormParent.x , platformBasePosition.y , 0 )  ; // /// this plateform position is w.r.t its parent
        // console.log( " newPositionPlatformBase " , newPositionPlatformBase ) ;
        //
        // // // we are finding the left and right wall positon w.r.t platform parent so that platform don't go beyond the left and right wall
        let leftWallWorldPosition = this.leftWall.getWorldPosition() ; 
        let rightWallWorldPosition = this.rightWall.getWorldPosition() ; 
        let leftWallPositionToPlateFormParent = this.platformBase.parent.getComponent(UITransform).convertToNodeSpaceAR(leftWallWorldPosition) ; 
        let rightWallPositionBGImageToPlateFormParent = this.platformBase.parent.getComponent(UITransform).convertToNodeSpaceAR(rightWallWorldPosition) ; 
        let widthPlatformBase = this.platformBase.getComponent(UITransform).width ;
        if( newPositionPlatformBase.x-widthPlatformBase/2 < leftWallPositionToPlateFormParent.x || newPositionPlatformBase.x >  rightWallPositionBGImageToPlateFormParent.x - widthPlatformBase/2) return ;
        this.platformBase.setPosition( newPositionPlatformBase  ) ;
    }

    generateBricksPattern()
    {
        console.log( "brick pattern function "  )
        // let totalPatternDesigns = brickPatternDesigns.length  ;
        // let selectRandomPattern = randomRangeInt(0 , totalPatternDesigns ) ;
        // console.log( " random index " , selectRandomPattern ) ;
        // let brickMatrix = brickPatternDesigns[selectRandomPattern] ;
        let brickMatrix = brickPatternDesigns[this.clickedLevel] ;
        let row = brickMatrix.length ;
        let randomNumber = randomRangeInt(0 , this.allColors.length)
        for (let i = 0; i < row; i++) 
        {
            let columns = brickMatrix[0].length ;
            let colorIndex = (i + randomNumber) % this.allColors.length  ;
            let brickColor = this.allColors[colorIndex].color ;
            // console.log( colorIndex , brickColor  ) ;
            let brickHeight = 0 ;
            let spacing = 1 ;
            let brickRow = instantiate(this.rowBrickPrefab);
            for (let j = 0; j < columns; j++) 
            {
                if( brickMatrix[i][j] == 0 ) continue ;
                this.totalBricks++ ;
                let brick = instantiate(this.singleBrickPrefab);
                let brickWidth = brick.getComponent(UITransform).width ;
                brickHeight = brick.getComponent(UITransform).height ;
                
                let brickPosition = new Vec3( j * brickWidth - brickWidth*columns / 2 + spacing*j   , 0 , 0 )
                brick.getComponent(Sprite).color = brickColor;
                brick.setPosition(brickPosition) ;
                brickRow.addChild(brick);
            }
            brickRow.setPosition( new Vec3( 0 , i * brickHeight - brickHeight*row / 2 + spacing*i , 0 ) )  ;
            this.allBricks.addChild(brickRow);
        }
    }




    timerAnimation( time : number )
    {
        console.log( "timer " , time ) ;
        const label = this.countdownLabel.getComponent(Label);
        label.string = ` ${time} `;
        label.fontSize = countdownLabelFontSize ; 
        tween(this.countdownLabel)
        .to(1, { fontSize : 0   }  , {
            onComplete : () => {
                this.resetBallandPlateformPosition() ;
                if( time == 1 )
                {
                    this.isAnimating = false  ;
                    this.launchBall() ;
                    return ;
                }
                this.timerAnimation(time-1) ;
            }
        } )
        .start() ;

    }
    launchBall() 
    {
        console.log( "in launch",this.ballInitialPosition , this.ballImage.position ) ;
        console.log( " launch ball " ) ;
        const ballRigidbody = this.ballImage.getComponent(RigidBody2D);
        console.log( " launch rigidball " ,ballRigidbody )
        ballRigidbody.applyLinearImpulseToCenter( new Vec2(10 , 30) , true) ;
    }

    onBeginContact(contact: any, selfCollider: any, otherCollider: any) 
    {
        console.log("on begin contact function");
        const ballRigidbody = this.ballImage.getComponent(RigidBody2D);

        if (selfCollider.node === this.bottomWall) 
        {
            let length = this.extraBalls.children.length;
            this.extraBalls.children[this.remainingBalls-1].destroy();
            this.remainingBalls--;
            if (this.remainingBalls == 0) {
                console.log("game over");
                director.loadScene(gamePlayScene);
                return;
            }
            this.changeBallColor() ;
            ballRigidbody.sleep() ;

            // // // if( ballRigidbody ) ballRigidbody.destroy() ;
            // // // this.ballImage.setPosition(this.ballInitialPosition) ;
            // // // console.log("pos => ",this.ballInitialPosition , this.ballImage.position , this.ballImage.getPosition() )
            // // // this.platformBase.setPosition( this.platformInitialPosition ) ;
            // // // let rig = this.ballImage.getComponent(RigidBody2D);
            // // // if( rig ) console.log( " avaidjcsk " ) ;

            this.isAnimating = true ; 
            this.timerAnimation(3);
        }
        else if (selfCollider.node.parent.parent === this.allBricks  )    
        {
            if( this.gameMode == 1 ) this.normalSingleBrickRemovalMode1( selfCollider.node ) ;
            else if( this.gameMode == 2 ) this.removeSameColorBallAndSingleBrickMode2(selfCollider.node , this.ballImage) ;
            else if( this.gameMode == 3 ) this.removeBrickWholeRowMode3( selfCollider.node )
            else if( this.gameMode == 4 ) this.removeSameColorBallAndWholeRowMode4( selfCollider.node , this.ballImage )
        }
    }
    changeBallColor()
    {
        let ballColor = this.ballImage.getComponent(Sprite).color ;
        const availableColors = this.allColors.filter(c => !ballColor.equals(c.color));
        let colorIndex = randomRangeInt(0, availableColors.length);
        let newColor = availableColors[colorIndex].color;
        this.ballImage.getComponent(Sprite).color = newColor;
    }
    normalSingleBrickRemovalMode1( singleBrick : Node )
    {
        singleBrick.destroy() ;
        this.incrementPlayerScore(1) ;
    }
    removeSameColorBallAndSingleBrickMode2( singleBrick:Node , ballImg :Node)
    {
        if( this.checkSameColor( singleBrick , ballImg ) )
        {
            console.log( " equals"  ) ;
            this.incrementPlayerScore(1) ;
            singleBrick.destroy() ;
        }
        else
        {
            this.changeBallColor() ;
        }
    }
    checkSameColor( singleBrick:Node , ballImg :Node) : boolean
    {
        let brickColor = singleBrick.getComponent(Sprite).color ;
        let ballColor = this.ballImage.getComponent(Sprite).color ;
        if( ballColor.equals(brickColor) ) return true ;
        return false ;
    }  
    removeBrickWholeRowMode3( singleBrick:Node )
    {
        this.incrementPlayerScore(singleBrick.parent.children.length) ;
        // let allBricksLayout = this.allBricks.getComponent(Layout) ;
        // if( allBricksLayout ) allBricksLayout.destroy() ;
        singleBrick.parent.destroy() ;
    }
    removeSameColorBallAndWholeRowMode4( singleBrick:Node , ballImg :Node )
    {
        if( this.checkSameColor( singleBrick , ballImg ) )
        {
            console.log( " equals"  ) ;
            this.incrementPlayerScore(singleBrick.parent.children.length) ;
            // let allBricksLayout = this.allBricks.getComponent(Layout) ;
            // if( allBricksLayout ) allBricksLayout.destroy() ;
            singleBrick.parent.destroy() ;
        }
        else
        {
            this.changeBallColor() ;
        }
    }
    resetBallandPlateformPosition()
    {
        this.ballImage.setPosition(this.ballInitialPosition) ;
        this.platformBase.setPosition( this.platformInitialPosition ) ;
    }
    incrementPlayerScore( value : number  )
    {
        // console.log( this.score , "  score and totalbrick  " , this.totalBricks ) ;
        this.score += value ;
        this.playerScore.string = this.score.toString() ;
        this.totalBricks -= value ;
        if( this.totalBricks == 0 )
        {
            this.levelWinner()
        }

    }


    levelWinner()
    {
        console.log( " levelwinner  ======> " ) ;
        console.log( "gamemodeindex   " , this.gameMode , 'clicklevel  ' , this.clickedLevel , 'score  ' , this.score ) ;
            
        Singleton.getInstance().setLevelScore( this.gameMode , this.clickedLevel, this.score);

        const ballRigidbody = this.ballImage.getComponent(RigidBody2D);
        ballRigidbody.sleep() ;
        ballRigidbody.linearVelocity = new Vec2(0 , 0) ; 
        // // // // this.resetBallandPlateformPosition() ;
        // // // // this.ballImage.destroy()  ;  
        //    
        console.log( "Player is winner " ) ;
        // window.alert( " Player is winner  " ) ;
        let gameModelevelWinner = Singleton.getInstance().getgameModeLevelWinner(this.gameMode) ;
        let winningLabelText = '' ;
        if( gameModelevelWinner == this.totalLevels )
        {
            this.nextGame = gameModeSelectionScene ;
            winningLabelText =  ` User completed the all levels of game mode ${this.gameMode} ` ;
            console.log( winningLabel )
        }
        else
        {
            this.nextGame = levelSelectionScene ;
            winningLabelText =  ` User completed the level ${this.clickedLevel} of game mode ${this.gameMode} ` ;
            console.log( winningLabel )
        }

        let windDialog = instantiate(this.winPrefab);
        let winnerPlayerNameLabel = windDialog.getChildByName(winningLabel);
        winnerPlayerNameLabel.getComponent(Label).string = winningLabelText ;
        let playNextGameButton = windDialog.getChildByName(playNextGame);
        this.node.addChild(windDialog);
        playNextGameButton.on(Button.EventType.CLICK , () => {
            director.loadScene(this.nextGame);
        } , this)
        
        
        
        // this.allBricks.destroyAllChildren() ;
        // // // Check why it is not working when I call it synchronously, but it works when I call it asynchronously.
        // // // this.generateBricksPattern() ;
        // this.scheduleOnce( () => {
        //     this.generateBricksPattern() ;
        // }  , 0 ) ;
        // director.loadScene(levelSelectionScene); 
    }

  
   
    update(deltaTime: number) 
    {
    }

    
}
