import { _decorator, SpriteFrame } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Singleton")
export class Singleton {
  static instance: Singleton = null;
  private Singleton() {}

  public static getInstance(): Singleton {
    if (this.instance === null) {
      this.instance = new Singleton();
    }
    return this.instance;
  }


  private _gameMode : number ;
  public set gameMode( val : number )
  {
    this._gameMode = val ;
  }
  public get gameMode()
  {
    return this._gameMode ;
  }


  private _totalLives : number ;
  public set totalLives( val : number )
  {
    this._totalLives = val ;
  }
  public get totalLives()
  {
    return this._totalLives ;
  }

  
  private _clickLevel: number;
  public set clickLevel(levelInd: number) 
  {
    this._clickLevel = levelInd;
  }
  public get clickLevel(): number 
  {
    return this._clickLevel;
  }

  
  

  private _levelScore: number[] = new Array(100).fill(0);  
  public set levelScore(levelInd: number) 
  {
    this._levelScore[levelInd] = 1;
  }
  public get levelScore(): number[] 
  {
    return this._levelScore;
  }





 








}