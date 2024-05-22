import { _decorator, BoxCollider2D, Collider2D, Color, Component, Contact2DType, director, EventMouse, instantiate, Intersection2D, Label, Layout, Node, PhysicsSystem2D, Prefab, randomRangeInt, RigidBody2D, Sprite, tween, Tween, UITransform, Vec2, Vec3 } from 'cc';
import { gamePlayScene , levelSelectionScene , countdownLabelFontSize } from './constants' ;
import { Singleton } from './gameManager/singleton';
import { brickPatternDesigns } from './bricksPatterns';


const { ccclass, property } = _decorator;

@ccclass('gamePlay')
export class gamePlay extends Component {

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
    ballImage: Node | null = null;
    @property({ type: Node })
    platformBase: Node | null = null;

    @property({ type: Node })
    extraBalls: Node | null = null;
    @property({ type: Prefab })
    extraBallsPrefab: Prefab | null = null;

    @property({ type: Label })
    countdownLabel: Label | null = null;

    @property({ type: Label })
    playerName: Label | null = null;
    @property({ type: Label })
    playerScore: Label | null = null;

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



    startGameButton()
    {
        this.timerAnimation( 3 ) ;
    }

    start() 
    {
        if( Singleton.getInstance().gameMode ) this.gameMode = Singleton.getInstance().gameMode ;
        if( Singleton.getInstance().totalLives ) this.totalLives = Singleton.getInstance().totalLives ;
        console.log( "game mode  " , this.gameMode , "total lives " , this.totalLives ) ;
        for(let i=0; i<this.totalLives; i++)
        {
            this.extraBalls.addChild(instantiate(this.extraBallsPrefab)) ;
        }
        console.log("start start start function");
        this.clickedLevel = Singleton.getInstance().clickLevel ;
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
        let mousePosition = event.getUILocation() ;
        let canvasWidth = this.node.getComponent(UITransform).width ;
        let platformBasePosition = this.platformBase.position ;
        let newPositionPlatformBase = new Vec3( mousePosition.x - canvasWidth/2  , platformBasePosition.y , 0 ) ;
        let leftWallPosition = this.leftWall.position ; 
        let rightWallPosition = this.rightWall.position ; 
        let widthPlatformBase = this.platformBase.getComponent(UITransform).width ;
        if( newPositionPlatformBase.x-widthPlatformBase/2 < leftWallPosition.x || newPositionPlatformBase.x >  rightWallPosition.x - widthPlatformBase/2) return ;
        this.platformBase.setPosition( newPositionPlatformBase  ) ;
    }

    generateBricksPattern()
    {
        console.log( "brick pattern function "  )
        let totalPatternDesigns = brickPatternDesigns.length  ;
        let selectRandomPattern = randomRangeInt(0 , totalPatternDesigns ) ;
        console.log( " random index " , selectRandomPattern ) ;
        let brickMatrix = brickPatternDesigns[selectRandomPattern] ;
        let row = brickMatrix.length ;
        for (let i = 0; i < row; i++) 
        {
            let columns = brickMatrix[0].length ;
            let colorIndex = randomRangeInt(0 , this.allColors.length )
            let brickColor = this.allColors[colorIndex].color ;
            // console.log( colorIndex , brickColor  ) ;
            let brickHeight = 0 ;
            let spacing = 20 ;
            let brickRow = instantiate(this.rowBrickPrefab);
            for (let j = 0; j < columns; j++) 
            {
                if( brickMatrix[i][j] == 0 ) continue ;
                this.totalBricks++ ;
                let brick = instantiate(this.singleBrickPrefab);
                let brickWidth = brick.getComponent(UITransform).width ;
                brickHeight = brick.getComponent(UITransform).height ;
                
                let brickPosition = new Vec3( j * brickWidth - brickWidth*columns / 2  + spacing , 0 , 0 )
                brick.getComponent(Sprite).color = brickColor;
                brick.setPosition(brickPosition) ;
                brickRow.addChild(brick);
            }
            brickRow.setPosition( new Vec3( 0 , i * brickHeight - brickHeight*row / 2 + spacing , 0 ) )  ;
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
        ballRigidbody.applyLinearImpulseToCenter( new Vec2(10 , 200) , true) ;
    }

    onBeginContact(contact: any, selfCollider: any, otherCollider: any) 
    {
        console.log("on begin contact function");
        const ballRigidbody = this.ballImage.getComponent(RigidBody2D);

        if (selfCollider.node === this.bottomWall) 
        {
            // let length = this.extraBalls.children.length;
            // this.extraBalls.children[this.remainingBalls-1].destroy();
            // this.remainingBalls--;
            // if (this.remainingBalls == 0) {
            //     console.log("game over");
            //     director.loadScene(gamePlayScene);
            //     return;
            // }
            this.changeBallColor() ;
            // ballRigidbody.sleep() ;

            // if( ballRigidbody ) ballRigidbody.destroy() ;
            // this.ballImage.setPosition(this.ballInitialPosition) ;
            // console.log("pos => ",this.ballInitialPosition , this.ballImage.position , this.ballImage.getPosition() )
            // this.platformBase.setPosition( this.platformInitialPosition ) ;
            // let rig = this.ballImage.getComponent(RigidBody2D);
            // if( rig ) console.log( " avaidjcsk " ) ;

            // this.isAnimating = true ; 
            // this.timerAnimation(3);
        }
        else if (selfCollider.node.parent.parent === this.allBricks  )    
        {
            if( this.gameMode == 1 ) this.normalSingleBrickRemovalMode1( selfCollider.node ) ;
            else if( this.gameMode == 2 ) this.removeSameColorBallAndSingleBrickMode2(selfCollider.node , this.ballImage) ;
            else if( this.gameMode == 3 ) this.removeBrickWholeRowMode3( selfCollider.node )
            else if( this.gameMode == 4 ) this.removeSameColorBallAndWholeRowMode4( selfCollider.node , this.ballImage )
        }
    }
    
    resetBallandPlateformPosition()
    {
        this.ballImage.setPosition(this.ballInitialPosition) ;
        this.platformBase.setPosition( this.platformInitialPosition ) ;
    }
    incrementPlayerScore( value : number  )
    {
        this.score += value ;
        console.log( this.score , "  score and totalbrick  " , this.totalBricks ) ;
        this.playerScore.string = this.score.toString() ;
        if( this.score == this.totalBricks )
        {
            console.log( this.clickedLevel , 'okokok ' , this.score ) ;
            // Singleton.getInstance().levelScore[this.clickedLevel] = this.score ;
            this.totalBricks = 0 , this.score = 0 ; 
            console.log( "Player is winner " ) ;
            window.alert( " Player is winner  " ) ;
            const ballRigidbody = this.ballImage.getComponent(RigidBody2D);
            ballRigidbody.sleep() ;
            ballRigidbody.linearVelocity = new Vec2(0 , 0) ; 
            this.resetBallandPlateformPosition() ;
            this.allBricks.destroyAllChildren() ;
            // this.ballImage.destroy()  ;

            // // // Check why it is not working when I call it synchronously, but it works when I call it asynchronously.
            // // // this.generateBricksPattern() ;
            this.scheduleOnce( () => {
                this.generateBricksPattern() ;
            }  , 0 ) ;
            return ;
        }
    }
    normalSingleBrickRemovalMode1( singleBrick : Node )
    {
        singleBrick.destroy() ;
        this.incrementPlayerScore(1) ;
    }
    checkSameColor( singleBrick:Node , ballImg :Node) : boolean
    {
        let brickColor = singleBrick.getComponent(Sprite).color ;
        let ballColor = this.ballImage.getComponent(Sprite).color ;
        if( ballColor.equals(brickColor) ) return true ;
        return false ;
    }
    changeBallColor()
    {
        let ballColor = this.ballImage.getComponent(Sprite).color ;
        const availableColors = this.allColors.filter(c => !ballColor.equals(c.color));
        let colorIndex = randomRangeInt(0, availableColors.length);
        let newColor = availableColors[colorIndex].color;
        this.ballImage.getComponent(Sprite).color = newColor;
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





    





    

   
   
    update(deltaTime: number) 
    {
    }




    
}
