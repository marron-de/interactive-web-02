import App from "./App.js" // ctx 가져오기 위해서 

export default class Background {
  constructor(config) {
    this.img = config.img
    this.height = App.height
    this.width = App.height * (this.img.width / this.img.height)
    // this.width : this.height = this.img.width : this.img.height
    this.leftPos = { x: 0, y: 0}
    this.rightPos = { x: this.width, y: 0}
    this.speed = config.speed

  }
  
  update() {
    if (this.leftPos.x + this.width < 0) {       
      this.leftPos.x = this.rightPos.x + this.width - 4 
      // 이미지 여백 있어서 임시처리 (-4)      
    }        
    if (this.rightPos.x + this.width < 0) {       
      this.rightPos.x = this.leftPos.x + this.width - 4 
      // 이미지 여백 있어서 임시처리 (-4)             
    }

    this.leftPos.x += this.speed
    this.rightPos.x += this.speed
  }

  draw() {
    App.ctx.drawImage( // 첫번째 배경
      this.img,
      this.leftPos.x, this.leftPos.y, this.width, this.height
    )
    App.ctx.drawImage( // 두번째 배견 (첫번째와 동일한 이미지 => 무한루프)
      this.img,
      this.rightPos.x, this.rightPos.y, this.width, this.height
    )
  }

}