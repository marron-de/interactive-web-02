import { hexToRgb, randomNumBetween } from "./utils.js"

export default class Particle {
  constructor(x, y, deg = 0, colors, shapes, spread = 30) {
    this.angle = Math.PI / 180 * randomNumBetween(deg - spread, deg + spread)
    this.r = randomNumBetween(30, 100)
    this.x = x * innerWidth
    this.y = y * innerHeight

    this.vx = this.r * Math.cos(this.angle)
    this.vy = this.r * Math.sin(this.angle)

    this.friction = 0.89
    this.gravity = 0.5

    this.width = 12
    this.height = 12

    this.opacity = 1

    this.widthDelta = randomNumBetween(0, 360) // 회전 각도 누적 (좌,우)
    this.heightDelta = randomNumBetween(0, 360) // 회전 각도 누적 (위,아래)

    this.rotation = randomNumBetween(0, 360)
    this.rotationDelta = randomNumBetween(-1, 1) // 시계방향 & 반시계방향

    this.colors = colors || ['#FF577F', '#FF884B', '#FFD384', '#FFF9B0']
    this.color = hexToRgb(
      this.colors[Math.floor(randomNumBetween(0, this.colors.length - 1))]        
      // colors 배열 중 랜덤 호출 => hex 값 가져오기
    )

    this.shapes = shapes || ['circle', 'square']
    this.shape = this.shapes[Math.floor(randomNumBetween(0, this.shapes.length - 1))]
    // shapes 배열 중 랜덤 호출 
    
  }
  update() {
    this.vy += this.gravity

    this.vx *= this.friction
    this.vy *= this.friction

    this.x += this.vx
    this.y += this.vy

    this.opacity -= 0.005

    this.widthDelta += 2
    this.heightDelta += 2

    this.rotation += this.rotationDelta
  }
  drawCircle(ctx) {
    ctx.beginPath()
    ctx.ellipse( // 반지름 두개를 가지고 타원 그리기
      this.x,
      this.y,
      Math.abs(this.width * Math.cos(Math.PI / 180 * this.widthDelta)) / 2, // 양수 값
      Math.abs(this.height * Math.sin(Math.PI / 180 * this.heightDelta)) / 2, // 양수 값
      0, // 회전 양
      0,
      Math.PI * 2
    )
    ctx.fill()
    ctx.closePath()
  }
  drawSquare(ctx) {
    ctx.fillRect(
      this.x,
      this.y,
      this.width * Math.cos(Math.PI / 180 * this.widthDelta),  // 범위는 -1 ~ 1
      this.height * Math.sin(Math.PI / 180 * this.heightDelta)  // 범위는 -1 ~ 1
    )
  }
  draw(ctx) {   
    ctx.translate(this.x + this.width * 1.2, this.y + this.height * 1.2) // ctx 기준
    ctx.rotate(Math.PI / 180 * this.rotation) // 회전 적용
    ctx.translate(-this.x - this.width * 1.2, -this.y - this.height * 1.2) // 원위치
    // this.width 와 this.height 값이 커질수록 애니메이션 범위가 커짐

    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`
        
    switch (this.shape) {
      case 'square': this.drawSquare(ctx); break
      case 'circle': this.drawCircle(ctx); break
    }

    ctx.resetTransform() // rotate 값이 계속 누적되므로 리셋
  }
}