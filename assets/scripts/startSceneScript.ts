import { _decorator, Component, director, Node } from 'cc';
import {  gameModeSelectionScene  } from './constants' ;


const { ccclass, property } = _decorator;

@ccclass('startSceneScript')
export class startSceneScript extends Component {


    playGame()
    {
        director.loadScene(gameModeSelectionScene)
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

