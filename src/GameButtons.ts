import * as PIXI from "pixi.js"
import {AssetLoader} from "./AssetLoader"
export class GameButtons extends PIXI.Container{
    textures: Record<string, PIXI.Texture >
    app!:PIXI.Application
     spinBtn !: PIXI.Sprite
     autoSpinBtn !: PIXI.Sprite
     turboSpinBtn !: PIXI.Sprite
    
    constructor(app:PIXI.Application){
        super();
        this.app = app;
        this.textures = AssetLoader.textures;
        this.build()
    }
    build(){
        this.spinBtn = new PIXI.Sprite(this.textures.spinBtn)
        this.spinBtn.position.set(this.app.screen.width/2+65,this.app.screen.height-75)
        this.spinBtn.anchor.set(0.5)
        this.spinBtn.scale.set(0.5)

        this.autoSpinBtn = new PIXI.Sprite(this.textures.autoSpinBtn)
         this.autoSpinBtn.position.set(this.app.screen.width/2+160,this.app.screen.height-56)
        this.autoSpinBtn.anchor.set(0.5)
        this.autoSpinBtn.scale.set(0.6)

        this.turboSpinBtn = new PIXI.Sprite(this.textures.turboSpinBtn)
        this.turboSpinBtn.position.set(this.app.screen.width/2-40,this.app.screen.height-56)
        this.turboSpinBtn.anchor.set(0.5)
        this.turboSpinBtn.scale.set(0.6)

        // States

        this.spinBtn.eventMode = "static"
        this.spinBtn.cursor = "pointer"
        this.autoSpinBtn.eventMode = "static"
        this.autoSpinBtn.cursor = "pointer"
        this.turboSpinBtn.eventMode = "static"
        this.turboSpinBtn.cursor = "pointer"


        this.spinBtn.on("pointerover" , ()=>{
            this.spinBtn.texture = this.textures.spinBtnHover
        })
        this.autoSpinBtn.on("pointerover" , ()=>{
            this.autoSpinBtn.texture = this.textures.autoSpinBtnHover
        })
        this.turboSpinBtn.on("pointerover" , ()=>{
            this.turboSpinBtn.texture = this.textures.turboSpinBtnHover
        })

        this.spinBtn.on("pointerout" , ()=>{
            this.spinBtn.texture = this.textures.spinBtn
        })
        this.autoSpinBtn.on("pointerout" , ()=>{
            this.autoSpinBtn.texture = this.textures.autoSpinBtn
        })
        this.turboSpinBtn.on("pointerout" , ()=>{
            this.turboSpinBtn.texture = this.textures.turboSpinBtn
        })



        this.addChild(this.spinBtn,this.autoSpinBtn,this.turboSpinBtn)
       
    }

}