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




  private _usernameLogin : boolean ;
  public set usernameLogin ( val : boolean )
  {
    this._usernameLogin = val ;
  }
  public get usernameLogin()
  {
    return this._usernameLogin ;
  }


  private _username : string ;
  public set username( val : string )
  {
    this._username = val ;
  }
  public get username()
  {
    return this._username ;
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



  // // // store how many levels player win in particular game mode
  private _gameModeLevelWinner = new Array(10).fill(0);

  public setgameModeLevelWinner(gameModeIndex : number ): void {
      this._gameModeLevelWinner[gameModeIndex] ++ ;
  }
  
  public getgameModeLevelWinner(gameModeIndex : number  ): number {
      return this._gameModeLevelWinner[gameModeIndex] ;
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


  




  private _totalLevel: number;
  public set totalLevel(val: number) 
  {
    this._totalLevel = val;
  }
  public get totalLevel(): number 
  {
    return this._totalLevel;
  }

  private _clickLevel: number;
  public set clickLevel(val: number) 
  {
    this._clickLevel = val;
  }
  public get clickLevel(): number 
  {
    return this._clickLevel;
  }









  // // // score 2d array of gameModeIndex and clickedLevel
  private _levelScore = new Array(10).fill(null).map(() => new Array(100).fill(0));

  public setLevelScore(gameModeIndex : number , clickedLevel: number, score: number): void {
      this._levelScore[gameModeIndex][clickedLevel] = score;
  }
  
  public getLevelScore(gameModeIndex : number , clickedLevel: number,): number {
      return this._levelScore[gameModeIndex][clickedLevel];
  }
  











 








}