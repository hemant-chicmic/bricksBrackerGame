import { _decorator, Button, Color, Component, EventHandler, instantiate, Node, Prefab, Sprite, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('generatePattern')

export class generatePattern extends Component {


    @property({ type: Node })
    allBricks: Node | null = null;
    @property({ type: Prefab })
    rowBrickPrefab: Prefab | null = null;
    @property({ type: Prefab })
    singleBrickPrefab: Prefab | null = null;
    
    @property({ type: Node })
    brickSelectionImages: Node | null = null;
    @property({ type: Prefab })
    selectedImagePrefab : Prefab | null = null;


    private rows : number ;
    private columns : number ;
    private allColors = [
        { name: "Red", color: new Color(255, 0, 0) },
        { name: "Green", color: new Color(0, 255, 0) },
        { name: "Yellow", color: new Color(255, 255, 0) },
        { name: "Orange", color: new Color(255, 165, 0) }, 
    ];
    private selectedColor : Color ;
    private brickBreakFreq : number = 0 ;
    private brickPatternData: { brickColor: Color; breakFreq: number }[][] = [];





    start() 
    {
        this.rows = 10 ;
        this.columns = 10 ;
        for (let i = 0; i < this.rows; i++) 
        {
            let brickHeight = 0 ;
            let spacing = 5 ;
            let brickRow = instantiate(this.rowBrickPrefab);
            for (let j = 0; j < this.columns; j++) 
            {
                let brick = instantiate(this.singleBrickPrefab);
                let brickButtonComponent = brick.addComponent(Button) ;
                brickButtonComponent.transition = Button.Transition.SCALE;
                brickButtonComponent.zoomScale = 1.1 ;
                brickButtonComponent.duration = 0.1;
                const clickEventHandler = new EventHandler();
                clickEventHandler.target = this.node;
                clickEventHandler.component = 'generatePattern';
                clickEventHandler.handler = 'makeBrick';
                clickEventHandler.customEventData = `${i},${j}`;
                brickButtonComponent.clickEvents.push(clickEventHandler);

                let brickWidth = brick.getComponent(UITransform).width ;
                brickHeight = brick.getComponent(UITransform).height ;   
                let brickPosition = new Vec3( j * brickWidth - brickWidth*this.columns / 2 + spacing*j   , 0 , 0 )
                brick.setPosition(brickPosition) ;
                brickRow.addChild(brick);
                
            }
            brickRow.setPosition( new Vec3( 0 , -(i * brickHeight - brickHeight*this.rows / 2 + spacing*i ), 0 ) )  ;
            this.allBricks.addChild(brickRow);
        }


        for(let i=0; i<this.allColors.length; i++)
        {
            let brickImage = instantiate( this.selectedImagePrefab ) ;
            let brickImageButtonComponent = brickImage.addComponent(Button) ;
            brickImageButtonComponent.transition = Button.Transition.SCALE;
            brickImageButtonComponent.zoomScale = 1.1 ;
            brickImageButtonComponent.duration = 0.1;
            const clickEventHandler = new EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = 'generatePattern';
            clickEventHandler.handler = 'imageSelection';
            clickEventHandler.customEventData = `${i}`;
            brickImageButtonComponent.clickEvents.push(clickEventHandler);
            brickImage.getComponent(Sprite).color = this.allColors[i].color ;
            this.brickSelectionImages.addChild(brickImage) ;
        }
        
       
        for(let i =0; i<this.rows; i++)
        {
            this.brickPatternData[i] = [];
            for(let j=0; j<this.columns; j++)
            {
                this.brickPatternData[i][j] = { brickColor: this.selectedColor , breakFreq: 0 };
            }
        }


    }



    imageSelection( event : Event , customEventData :string )
    {
        console.log( "imageSelection " , customEventData ) ;
        let index = parseInt(customEventData) ;
        let brickImage = this.brickSelectionImages.children[index] ;
        this.selectedColor = brickImage.getComponent(Sprite).color ;
    }

    selectbrickBreakFreq( event : Event , customEventData : string )
    {
        console.log( "selectbrickBreakFreq" , parseInt(customEventData) ) ;
        this.brickBreakFreq = parseInt(customEventData) ;
    }



    makeBrick( event:Event , customEventData : string  )
    {
        console.log( "makeBrick " , event )
        const [i, j] = customEventData.split(',').map(Number);
        // console.log("index brick ", i , j  );
        const brick = this.allBricks.children[i].children[j] ;  
        // console.log("brick ", brick );
        if( ! this.selectedColor ) return ;
        brick.getComponent(Sprite).color = this.selectedColor  ;
        this.brickPatternData[i][j] = { brickColor: this.selectedColor , breakFreq: this.brickBreakFreq };
        console.log( " pateerdata" , this.brickPatternData[i][j] ) ;
    }

    
    // savePattern()
    // {
    //     console.log( "savePattern" ) ;
    //     console.log( this.brickPatternData ) ;
    //     // for(let i =0; i<this.rows; i++)
    //     // {
    //     //     for(let j=0; j<this.columns; j++)
    //     //     {
    //     //         let brick = this.brickPatternData[i][j] ;
    //     //         console.log( brick ) ;
    //     //     }
    //     // }
    // }





    // // // // when user will click the save pattern button it will save the pattern and convert the pattern into 
    // // // // json formate and also downlaod the josn file 
    savePattern() {
        console.log("savePattern");
        console.log(this.brickPatternData);
    
        // Convert pattern data array to JSON string
        this.scheduleOnce( () => {
            const jsonString = JSON.stringify(this.brickPatternData, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const a = document.createElement("a");
            a.href = window.URL.createObjectURL(blob);
            a.download = "patternData.json";
            a.click();
            window.URL.revokeObjectURL(a.href);
            console.log("Pattern data saved as patternData.json");
        } , 1 )
    }
    






    update(deltaTime: number) {
        
    }





}

