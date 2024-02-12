import Mouse from "./Mouse.js"
import Rope from "./Rope.js"
import { randomNumBetween } from './utils.js'

export default class App {
  static width = innerWidth // static : 상수로 사용되는 값, 항상 동일한값
  static height = innerHeight
  static dpr = devicePixelRatio > 1 ? 1 : 1
  static interval = 1000 / 60

  constructor() {
    this.canvas = document.querySelector('canvas')
    this.ctx = this.canvas.getContext('2d') 
    // canvas와 ctx는 DOM 요소이기 때문에 클래스가 로드될 때 단 한 번만 초기화되므로 이러한 사용은 현재 페이지의 상태에 따라 변할 수 있기에 상수로 지정하지 않음

    this.resize()
    window.addEventListener('resize', this.resize.bind(this))

    this.mouse = new Mouse(this.canvas)

    // this.createRopes()
  }

  resize() {
    App.width = innerWidth
    App.height = innerHeight

    this.canvas.style.width = App.width + 'px'
    this.canvas.style.height = App.height + 'px'

    this.canvas.width = App.width * App.dpr
    this.canvas.height = App.height * App.dpr
    this.ctx.scale(App.dpr, App.dpr)

    this.initRopes()
  }

  initRopes() {
    this.ropes = []
    const TOTAL = App.width * 0.04 // 화면 너비에 따라 개수 생성
    for (let i = 0; i < TOTAL + 1; i++) {
      const x = randomNumBetween(App.width * 0.3, App.width * 0.7)
      const y = 0
      const gap = randomNumBetween(App.height * 0.05, App.height * 0.08)
      const segments = 10
      const rope = new Rope({ x, y, gap, segments })
      rope.pin(0)

      this.ropes.push(rope)
    }
  }

  render() {
    let now, delta
    let then = Date.now()

    const frame = () => {
      requestAnimationFrame(frame) // 재귀함수
      now = Date.now()
      delta = now - then
      if (delta < App.interval) return
      then = now - (delta % App.interval)

      this.ctx.clearRect(0, 0, App.width, App.height) // 프레임 리셋

      // draw here
      this.ropes.forEach(rope => {
        rope.update(this.mouse)
        rope.draw(this.ctx)
      })

    }

    requestAnimationFrame(frame)
  }
}