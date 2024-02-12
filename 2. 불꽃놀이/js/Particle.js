import CanvasOption from "./CanvasOption.js"

export default class Particle extends CanvasOption {
  constructor(x, y, vx, vy, opacity, colorDeg) {
    super();
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.opacity = opacity
    this.gravity = 0.12
    this.friction = 0.93
    this.colorDeg = colorDeg
  }

  update() {
    this.vy += this.gravity // 중력 (폭죽 터지고 떨어지는)

    this.vx = this.vx * this.friction // x방향 점점느려지게 (폭죽 터질때)
    this.vy = this.vy * this.friction // y방향 점점느려지게 (폭주 터질때)

    this.x += this.vx // x방향 증가량
    this.y += this.vy // y방향 증가량

    this.opacity -= 0.02
  }

  draw() {
    this.ctx.fillStyle = `hsla(${this.colorDeg}, 100%, 65%, ${this.opacity})`
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 2, 0, Math.PI * 2)
    this.ctx.fill();
    this.ctx.closePath();
  }
}