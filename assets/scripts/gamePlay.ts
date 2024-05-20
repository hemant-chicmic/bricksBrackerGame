import { _decorator, BoxCollider2D, Collider2D, Color, Component, Contact2DType, director, EventMouse, instantiate, Intersection2D, Label, Layout, Node, PhysicsSystem2D, Prefab, randomRangeInt, RigidBody2D, Sprite, tween, Tween, UITransform, Vec2, Vec3 } from 'cc';
import { gamePlayScene , countdownLabelFontSize } from './constants' ;

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


    @property({ type: Label })
    countdownLabel: Label | null = null;






    private ballInitialPosition : Vec3 = new Vec3(0,0,0) ;
    private remainingBalls : number = 3 ;
    private isAnimating : boolean = true ; 




    start() 
    {
        console.log("start start start function");
        this.ballInitialPosition = this.ballImage.getPosition()
        console.log( "on Start",this.ballInitialPosition , this.ballImage.position ) ;
        this.node.on( Node.EventType.MOUSE_MOVE , this.onMouseMove  , this  ) ;
        let ballCollider = this.ballImage.getComponent(Collider2D);
        ballCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        
        for (let i = 0; i < 10; i++) 
        {
            let brickRow = instantiate(this.rowBrickPrefab);
            let brickColor = new Color(randomRangeInt(0, 255), randomRangeInt(0, 255), randomRangeInt(0, 255));
            for (let j = 0; j < 10; j++) 
            {
                let brick = instantiate(this.singleBrickPrefab);
                brick.getComponent(Sprite).color = brickColor;
                brickRow.addChild(brick);
                brickRow.getComponent(Layout).updateLayout();
            }
            this.allBricks.addChild(brickRow);
            
        }
        this.allBricks.getComponent(Layout).updateLayout();

        this.timerAnimation( 3 ) ;
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
                if( time == 1 )
                {
                    this.isAnimating = false  ;
                    console.log( "launch after timer  " , this.ballInitialPosition ) ;
                    this.launchBall() ;
                    return ;
                }
                label.string = ` ${time-1} ` ;
                this.timerAnimation(time-1) ;
            }
        } )
        .start() ;

    }

    onBeginContact(contact: any, selfCollider: any, otherCollider: any) 
   {
        console.log("on begin contact function");
        const ballRigidbody = this.ballImage.getComponent(RigidBody2D);

        if (selfCollider.node === this.bottomWall) 
        {
            let length = this.extraBalls.children.length;
            this.extraBalls.children[length - this.remainingBalls].destroy();
            this.remainingBalls--;
            if (this.remainingBalls == 0) {
                // console.log("game over");
                // window.alert("Game Over. Play Again");
                director.loadScene(gamePlayScene);
                return;
            }
            ballRigidbody.linearVelocity = new Vec2(0, 0);
            console.log("pos",this.ballInitialPosition)
            this.ballImage.setPosition(this.ballInitialPosition) ;
            this.isAnimating = true ; 
            
            this.scheduleOnce( () => {
                this.launchBall() ;
            } , 2 )
            // this.timerAnimation(3);
        }
        else if (selfCollider.node.parent.parent === this.allBricks) 
        {
            let brickRowLayout = selfCollider.node.parent.getComponent(Layout);
            if (brickRowLayout) brickRowLayout.destroy();
            selfCollider.node.destroy();
        }
    }



    launchBall() 
    {
        console.log( "in launch",this.ballInitialPosition , this.ballImage.position ) ;
        this.ballImage.setPosition(this.ballInitialPosition) ;
        console.log( " launch ball " ) ;
        const ballRigidbody = this.ballImage.getComponent(RigidBody2D);
        ballRigidbody.applyLinearImpulseToCenter( new Vec2(10 , 15) , true) ;
    }


    onMouseMove(event : EventMouse )
    {
        // console.log( " mouse " , this.isAnimating ) ;
        // if( this.isAnimating ) return ;
        // console.log( " mouse move"  ) ;
        let mousePosition = event.getUILocation() ;
        // console.log(" mouse position " , mousePosition   ) ;
        let canvasWidth = this.node.getComponent(UITransform).width ;
        let platformBasePosition = this.platformBase.position ;
        let newPositionPlatformBase = new Vec3( mousePosition.x - canvasWidth/2  , platformBasePosition.y , 0 ) ;
        let leftWallPosition = this.leftWall.position ; 
        let rightWallPosition = this.rightWall.position ; 
        let widthPlatformBase = this.platformBase.getComponent(UITransform).width ;
        if( newPositionPlatformBase.x-widthPlatformBase/2 < leftWallPosition.x || newPositionPlatformBase.x >  rightWallPosition.x - widthPlatformBase/2) return ;
        this.platformBase.setPosition( newPositionPlatformBase  ) ;
    }

   
    update(deltaTime: number) 
    {
    }




    
}
