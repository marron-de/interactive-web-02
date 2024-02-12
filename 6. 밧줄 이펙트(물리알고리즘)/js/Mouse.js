import App from "./App.js"
import Vector from "./Vector.js"

export default class Mouse {
  constructor(canvas) {
    this.pos = new Vector(-1000, -1000) // 처음에는 숨겨놓기 위해
    this.radius = 40 // 마우스의 범위

    canvas.onmousemove = e => this.pos.setXY(e.clientX, e.clientY)
    canvas.ontouchmove = e => this.pos.setXY(e.touches[0].clientX, e.touches[0].clientY)
    canvas.ontouchcancel = () => this.pos.setXY(-1000, -1000)
    canvas.ontouchend = () => this.pos.setXY(-1000, -1000)
  }
}