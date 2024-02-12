import Dot from "./Dot.js"
import Stick from "./Stick.js"

export default class Rope {
  constructor(config) {
    this.x = config.x
    this.y = config.y
    this.segments = config.segments || 8 // 생성할 점의 개수
    this.gap = config.gap || 40 // 점과 점 사이의 거리 = 초기 stick의 길이
    this.iterations = config.iterations || 10 // 업데이트 반복 횟수

    this.dots = []
    this.sticks = []

    this.create()
  }

  pin(index) { // 점 고정
    this.dots[index].pinned = true
  }

  checkPullingOut() {
    const dist = this.dots[0].pos.dist(this.dots[1].pos) // 늘어난 길이
    if(dist / this.sticks[0].length > 1.4) { // 길이가 1.2배 이상으로 늘어나면 고정 해제
      this.dots[0].pinned = false
    }
  }

  create() {   
    for (let i = 0; i < this.segments; i++) {
      this.dots.push(new Dot(this.x, this.y + i * this.gap)) 
      // y축만 gap만큼 이동하면서 생성
    }
    for (let i = 0; i < this.segments - 1; i++) { // 선분은 점보다 1개가 적어야 하므로
      this.sticks.push(new Stick(this.dots[i], this.dots[i + 1]))
    }
  }
  
  update(mouse) {
    // this.checkPullingOut()

    this.dots.forEach(dot => {
      dot.update(mouse)
    })  
    for (let i = 0; i < this.iterations; i++) { // 여러번 동작시켜 사이드 이펙트 줄이기
      this.sticks.forEach(stick => {
        stick.update()
      })
    }  
  }

  draw(ctx) {
    this.dots.forEach(dot => {
      dot.draw(ctx)
    })      
    this.sticks.forEach(stick => {
      stick.draw(ctx)
    })
    this.dots[this.dots.length - 1].drawLight(ctx)
  }
}