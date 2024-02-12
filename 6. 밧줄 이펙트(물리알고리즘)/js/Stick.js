export default class Stick {
  constructor(p1, p2) { // 선이기 때문에 두 점을 인자로 사용 
    this.startPoint = p1
    this.endPoint = p2
    this.color = '#999'

    this.length = this.startPoint.pos.dist(this.endPoint.pos) // 두 좌표의 거리(선의 길이)

    this.tension = 0.5 // 1보다 작을때 원래 길이로 돌아갈려는 스프링 효과
  }

  update() {
    const dx = this.endPoint.pos.x - this.startPoint.pos.x // 두 좌표의 x 길이
    const dy = this.endPoint.pos.y - this.startPoint.pos.y // 두 좌표의 y 길이

    const dist = Math.sqrt(dx * dx + dy * dy) // 두 좌표의 거리(현재 선의 길이)
    const diff = (dist - this.length ) / dist

    const offsetX = diff * dx * this.tension
    const offsetY = diff * dy * this.tension
    // a.x / (dist - length) = dx / dist (= / dist * dx)
    // a.y / (dist - length) = dy / dist (= / dist * dy)

    const m = this.startPoint.mass + this.endPoint.mass
    const m1 = this.endPoint.mass / m // offset * e무게 / (s무게 + e무게)
    const m2 = this.startPoint.mass / m // offset * s무게 / (s무게 + e무게)
    // 시작점은 끝점의 무게만큼 이동, 끝점은 시작점의 무게만큼 이동

    if (!this.startPoint.pinned) {
      this.startPoint.pos.x += offsetX * m1
      this.startPoint.pos.y += offsetY * m1
    }

    if (!this.endPoint.pinned) {
      this.endPoint.pos.x -= offsetX * m2
      this.endPoint.pos.y -= offsetY * m2
    }

  }

  draw(ctx) {
    ctx.beginPath()
    ctx.strokeStyle = this.color
    ctx.lineWidth = 1
    ctx.moveTo(this.startPoint.pos.x, this.startPoint.pos.y)
    ctx.lineTo(this.endPoint.pos.x, this.endPoint.pos.y)
    ctx.stroke()
    ctx.closePath()
  }
}