import * as PIXI from "pixi.js";
import { AssetLoader } from "./AssetLoader.js";

export class StakeControl extends PIXI.Container {
    textures: Record<string, PIXI.Texture >
    app:PIXI.Application;
    stakeAmount:number
    balance :number
    win : number
    maxCount :number
  constructor(app:PIXI.Application) { 
    super();
    this.app=app;
    this.textures = AssetLoader.textures;
    this.stakeAmount=100;
    this.balance=10000;
    this.win =0;
    this.maxCount = 100;
    this.build()
  }
  build(){
    const controls = new PIXI.Container;


    const incBtn = new PIXI.Sprite(this.textures.incBtn);
    incBtn.anchor.set(0.5)
    incBtn.scale.set(0.5)
    incBtn.position.set(this.app.screen.width-165,this.app.screen.height-40)

    const decBtn = new PIXI.Sprite(this.textures.decBtn);
    decBtn.anchor.set(0.5)
    decBtn.scale.set(0.5)
    decBtn.position.set(this.app.screen.width-382,this.app.screen.height-40)
     
   
    const stakeDisp = new PIXI.Sprite(this.textures.stakeBg);
    stakeDisp.anchor.set(0.5)
    stakeDisp.scale.set(0.5,0.65)
    stakeDisp.position.set(0,0)



    const stakeText = new PIXI.Text({
        text:`$${this.stakeAmount}\nSTAKE`,
        style:{
           fill:0xff000,
           align:"center",
           fontSize:17,
           fontWeight:"700"
        }

    });
    stakeText.anchor.set(0.5)
    stakeText.position.set(0,0)

    
     const StakeDisplay = new PIXI.Container;
    StakeDisplay.position.set(this.app.screen.width-273,this.app.screen.height-40)
    const bounds = StakeDisplay.getLocalBounds()
    StakeDisplay.pivot.set(
        bounds.x+bounds.width/2,
        bounds.y+bounds.height/2
    )

    StakeDisplay.addChild(stakeDisp,stakeText)
    
    const BalWin = new PIXI.Container();
    
    const balanceText = new PIXI.Text({
        text:`$${this.balance}\nBALANCE`,
        style:{
           fill:0xff000,
           align:"center",
           fontSize:17,
           fontWeight:"700"
        }

    });
    const winText = new PIXI.Text({
        text:`$${this.win}\nWIN`,
        style:{
           fill:0xff000,
           align:"center",
           fontSize:17,
           fontWeight:"700"
        }

    });

    BalWin.addChild(balanceText,winText)
    winText.position.set(150,0)
    BalWin.position.set(150,this.app.screen.height-60)


    incBtn.eventMode = "static"
    incBtn.cursor ="pointer"
    decBtn.eventMode = "static"
    decBtn.cursor ="pointer"

    incBtn.on("pointerdown" , ()=>{
        if(this.stakeAmount<this.maxCount){
            this.stakeAmount+=20;
            stakeText.text= `$${this.stakeAmount}\nSTAKE`
        }
    })
    decBtn.on("pointerdown" , ()=>{
        if(this.stakeAmount>0){
            this.stakeAmount-=20
             stakeText.text= `$${this.stakeAmount}\nSTAKE`
        }
    })
    
    this.addChild(incBtn,decBtn,StakeDisplay,BalWin)
  }
}