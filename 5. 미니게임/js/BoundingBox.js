import App from "./App.js"

export default class BoundingBox {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = `rgba(255, 0, 0, 0.3)`
  }
  isColliding(target) {
    return ( // 교집합(충돌) 발생시 아래의 조건들 충족됨
      target.x + target.width >= this.x &&
      target.x <= this.x + this.width &&
      target.y + target.height >= this.y &&
      target.y <= this.y + this.height
    )
  }
  draw() {
    App.ctx.fillStyle = this.color
    App.ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}