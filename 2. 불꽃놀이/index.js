import CanvasOption from "./js/CanvasOption.js"
import Particle from "./js/Particle.js"
import Tail from "./js/Tail.js"
import { hypotenuse, randomNumBetween } from "./js/utils.js"
import Spark from "./js/Spark.js"

class Canvas extends CanvasOption {
  constructor() {
    super()

    this.tails = []
    this.particles = []
    this.sparks = []

  }

  init() {
    this.canvasWidth = innerWidth
    this.canvasHeight = innerHeight
    this.canvas.width = this.canvasWidth * this.dpr
    this.canvas.height = this.canvasHeight * this.dpr
    this.ctx.scale(this.dpr, this.dpr)

    this.canvas.style.width = this.canvasWidth + 'px'
    this.canvas.style.height = this.canvasHeight + 'px'

    this.createParticles()
  }

  createTail() {
    const x = randomNumBetween(this.canvasWidth * 0.2, this.canvasWidth * 0.8)
    // 화면에 잘리지않게 20%~80% 사이로 위치 지정
    const vy = this.canvasHeight * randomNumBetween(0.01, 0.015) * -1
    // 속도가 점점 줄어들게 하기위해 -1 곱하기
    // Tail.js 의 friction과 같이 조절하면서 멈추는 위치 조절
    const colorDeg = randomNumBetween(0, 360)
    this.tails.push(new Tail(x, vy, colorDeg))
  }

  createParticles(x, y, colorDeg) {
    const PARTICLE_NUM = 400
    for (let i = 0; i < PARTICLE_NUM; i++) {
      const r = randomNumBetween(2, 100) * hypotenuse(innerWidth, innerHeight) * 0.0001
      const angle = Math.PI / 180 * randomNumBetween(0, 360) // 0~360도 까지
      const vx = r * Math.cos(angle) // cos(angle)= x/r => x = r * cos(θ)
      const vy = r * Math.sin(angle) // sin(angle)= y/r => y = r * sin(θ)
      const opacity = randomNumBetween(0.6, 0.9)
      const _colorDeg = randomNumBetween(-20, 20) + colorDeg // tail 인접색상
      this.particles.push(new Particle(x, y, vx, vy, opacity, _colorDeg))
    }
  }

  render() {
    let now, delta
    let then = Date.now()

    const frame = () => {
      requestAnimationFrame(frame)
      now = Date.now()
      delta = now - then
      if (delta < this.interval) return
      this.ctx.fillStyle = this.bgColor + '40' // #00000010  => 잔상 효과
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)

      this.ctx.fillStyle = `rgba(255,255,255, ${this.particles.length/50000})` 
      // 폭죽 터졌을때 배경 밝아짐
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)

      if (Math.random() < 0.03) this.createTail()

      this.tails.forEach((tail, index) => {
        tail.update()
        tail.draw()

        for (let i = 0; i < Math.round(-tail.vy * 0.5) ; i++) {
          const vx = randomNumBetween(-5,5) * 0.05
          const vy = randomNumBetween(-5,5) * 0.05
          const opacity = Math.min(-tail.vy, 0.5)
          this.sparks.push(new Spark(tail.x, tail.y, vx, vy, opacity, tail.colorDeg))
        }

        if (tail.vy > -0.7) { 
          // vy가 0가 가까워지는 시점 
          // tail이 도착하기도 전에 폭죽이 터져서 0.7로 지정하여 사라지는 속도 조절
          this.tails.splice(index, 1)
          this.createParticles(tail.x, tail.y, tail.colorDeg)
        }
      })

      this.particles.forEach((particle, index) => {
        particle.update()
        particle.draw()

        if(Math.random() < 0.1) {
          // partcile 생성될때 spark 생성
          this.sparks.push(new Spark(particle.x, particle.y, 0, 0, 0.3, 45))
        }        

        if (particle.opacity < 0) {
          this.particles.splice(index, 1) // opacity 0이 되면 배열에서 요소 삭제
        }
      })

      this.sparks.forEach((spark, index) => {
        spark.update()
        spark.draw()
        
        if (spark.opacity < 0) {
          this.sparks.splice(index, 1) // opacity 0이 되면 배열에서 요소 삭제
        }
      })

      then = now - (delta % this.interval)
    }
    requestAnimationFrame(frame)
  }
}

const canvas = new Canvas()

window.addEventListener('load', () => {
  canvas.init();
  canvas.render();
})

window.addEventListener('resize', () => {
  canvas.init();
})