import * as PIXI from "pixi.js";
import { SymbolLoader } from "./SymbolLoader";
import {StakeControl} from "./StakeControl"

export class ReelArea extends PIXI.Container {
  // config
  reelCount = 5;
  rowsCount = 6;
  symbolSize = 130;
  reelGap = 41;
  symbolGapY = 20;

  spinSpeed = 45;
  fallSpeed = 40;

  // state
  isSpinning = false;

  isFalling = false;
  isBlurSpinning = false;

  // pixi refs
  app: PIXI.Application;
  reelsContainer: PIXI.Container;
  blurReelsContainer?: PIXI.Container;
  StakeControl:StakeControl;

  // textures
  normalSymbolTextures: PIXI.Texture[];
  blurSymbolTextures: PIXI.Texture[];

  constructor(app: PIXI.Application , stakeControl:StakeControl) {
    super();
    this.app = app;

    this.normalSymbolTextures = SymbolLoader.symbols.normal;
    this.blurSymbolTextures = SymbolLoader.symbols.blur;
    this.StakeControl= stakeControl
    this.reelsContainer = new PIXI.Container();
    this.addChild(this.reelsContainer);

    this.buildMask();
    this.initSpawnNormalReels();

    this.reelsContainer.y = -750;

//     window.addEventListener("keydown", (e) => {
//   if (e.code === "Space") {
//     if(!this.isBlurSpinning){
//         this.spin();
//     this.StakeControl.UpdateBalance()}
    
//   }
// });

  }

  spin() {
  if (this.isSpinning) return; // ⛔ prevent double press
  this.isSpinning = true;
   this.spawnNormalReels()
  // reset position for next spin
  this.reelsContainer.y = -750;

  this.startBlurSpin();

  setTimeout(() => {
    this.stopBlurSpin();
  }, 1500);
 
  setTimeout(() => {
    this.startFall();
  }, 1200);
}

  

  // ---------------- MASK ----------------

  buildMask() {
    const mask = new PIXI.Graphics();
    mask.rect(0, 0, 845, 460);
    mask.fill(0x00ff00);

    mask.pivot.set(mask.width / 2, mask.height / 2);
    mask.position.set(
      this.app.screen.width / 2 + 63,
      this.app.screen.height / 2 + 7
    );

    this.reelsContainer.mask = mask;
    this.addChild(mask);
  }

  // ---------------- NORMAL REELS ----------------

  spawnNormalReels() {
    this.reelsContainer.removeChildren();

    const totalWidth =
      this.reelCount * this.symbolSize +
      (this.reelCount - 1) * this.reelGap;

    const startX =
      this.app.screen.width / 2 + 63 - totalWidth / 2;

    for (let i = 0; i < this.reelCount; i++) {
      const reel = new PIXI.Container();
      reel.x = startX + i * (this.symbolSize + this.reelGap);

      for (let j = 0; j < this.rowsCount; j++) {
        const tex =
          this.normalSymbolTextures[
            Math.floor(Math.random() * this.normalSymbolTextures.length)
          ];

        const symbol = new PIXI.Sprite(tex);
        symbol.width = symbol.height = this.symbolSize;
        symbol.y = j * (this.symbolSize + this.symbolGapY);

        reel.addChild(symbol);
      }

      this.reelsContainer.addChild(reel);
    }
  }
  initSpawnNormalReels() {
    this.reelsContainer.removeChildren();

    const totalWidth =
      this.reelCount * this.symbolSize +
      (this.reelCount - 1) * this.reelGap;

    const startX =
      this.app.screen.width / 2 + 63 - totalWidth / 2;

    for (let i = 0; i < this.reelCount; i++) {
      const reel = new PIXI.Container();
      reel.x = startX + i * (this.symbolSize + this.reelGap);

      for (let j = 0; j < this.rowsCount; j++) {
        const tex =
          this.normalSymbolTextures[
            Math.floor(Math.random() * this.normalSymbolTextures.length)
          ];

        const symbol = new PIXI.Sprite(tex);
        symbol.width = symbol.height = this.symbolSize;
        symbol.y = j * (this.symbolSize + this.symbolGapY)+750;

        reel.addChild(symbol);
      }

      this.reelsContainer.addChild(reel);
    }
  }

  // ---------------- FALL ----------------

  startFall() {
    if (this.isFalling) return;
    this.isFalling = true;
    this.app.ticker.add(this.onFall, this);
  }

  onFall(ticker: PIXI.Ticker) {
  this.reelsContainer.y += this.fallSpeed * ticker.deltaTime;

  if (this.reelsContainer.y >= 0) {
    this.reelsContainer.y = 0;
    this.isFalling = false;
    this.isSpinning = false; // ✅ unlock next spin
    this.app.ticker.remove(this.onFall, this);
  }
}


  // ---------------- BLUR REELS ----------------

  createBlurSymbol() {
    const tex =
      this.blurSymbolTextures[
        Math.floor(Math.random() * this.blurSymbolTextures.length)
      ];

    const symbol = new PIXI.Sprite(tex);
    symbol.width = symbol.height = this.symbolSize;
    return symbol;
  }

  spawnBlurReels() {
    this.blurReelsContainer?.destroy({ children: true });

    const container = new PIXI.Container();

    for (let i = 0; i < this.reelCount; i++) {
      const reel = new PIXI.Container();
      reel.x = i * (this.symbolSize + this.reelGap);

      for (let j = 0; j < this.rowsCount; j++) {
        const symbol = this.createBlurSymbol();
        symbol.y = j * this.symbolSize;
        reel.addChild(symbol);
      }

      container.addChild(reel);
    }

    container.x = this.reelsContainer.x + 420;
    container.y = 750;

    this.reelsContainer.addChild(container);
    this.blurReelsContainer = container;
  }

  startBlurSpin() {
    if (this.isBlurSpinning) return;

    if (!this.blurReelsContainer) {
      this.spawnBlurReels();
    }

    this.isBlurSpinning = true;
    this.app.ticker.add(this.onBlurSpin, this);
  }

  onBlurSpin(ticker: PIXI.Ticker) {
  if (!this.blurReelsContainer) return;

  for (const reel of this.blurReelsContainer.children as PIXI.Container[]) {
    for (const symbol of reel.children as PIXI.Sprite[]) {
      symbol.y += this.spinSpeed * ticker.deltaTime;

      // when symbol goes out of bottom
      if (
        symbol.y >=
        this.rowsCount * (this.symbolSize + this.symbolGapY) - 100
      ) {
        symbol.y = 0;

        // change texture for illusion
        const index = Math.floor(
          Math.random() * this.blurSymbolTextures.length
        );
        symbol.texture = this.blurSymbolTextures[index];
      }
    }
  }
}


  stopBlurSpin() {
    if (!this.blurReelsContainer) return;

    this.isBlurSpinning = false;
    this.app.ticker.remove(this.onBlurSpin, this);

    this.blurReelsContainer.removeFromParent();
    this.blurReelsContainer.destroy({ children: true });
    this.blurReelsContainer = undefined;
  }
}
