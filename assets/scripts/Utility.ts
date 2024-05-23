import { _decorator, AudioSource, Button, Component, director, EditBox, instantiate, Label, Layout, Node, Prefab, Scene, Sprite, SpriteFrame, Tween } from 'cc';




export function switchButton(onButton:Node, offButton : Node , status:boolean){
    onButton.active = status;
    offButton.active = !status;
}







