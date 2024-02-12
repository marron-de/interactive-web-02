import App from "./App.js"
import BoundingBox from "./BoundingBox.js"

export default class Player {
  constructor() {
    this.img = document.querySelector('#bird-img')
    this.x = App.width * 0.1
    this.y = App.height * 0.5
    this.width = 130
    this.height = this.width * (this.img.height / (this.img.width / 15))
    // this.img.width / 15 새의 1개당 이미지 넓이
    // this.width : this.height = this.img.width : this.img.height

    this.boundingBox = new BoundingBox(this.x + 10, this.y + 16, this.width - 20, this.height - 20)

    this.counter = 0
    this.frameX = 0

    this.vy = -7.5
    this.gravity = 0.3
    App.canvas.addEventListener('click', () => {
      this.vy += -5
    })
  }

  update() {    
    if (++this.counter % 2 === 0) { // 숫자가 클수록 속도가 느려짐
      this.frameX = ++this.frameX % 15 
      // this.frameX를 1씩 증가하고 나눈 나머지값 
      // 14까지는 나머지가 14이고 15이면 0부터 시작
    }
    
    this.vy += this.gravity
    this.y += this.vy
    this.boundingBox.y = this.y + 16
  }

  draw() {
    App.ctx.drawImage(
      this.img,
      this.img.width / 15 * this.frameX, 0, this.img.width / 15, this.img.height,
      this.x, this.y, this.width, this.height,
    )    
    // this.boundingBox.draw()
  }
}