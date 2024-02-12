const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d') // 그리는 도구
const dpr = window.devicePixelRatio

let canvasWidth
let canvasHeight
let particles

function init() {
  canvasWidth = innerWidth // 가로 전체
  canvasHeight = innerHeight // 세로 전체
  // canvas css 사이즈와 고유의 사이즈(초기값:300 x 150)를 일치시켜 주기

  canvas.style.width = canvasWidth + 'px'
  canvas.style.height = canvasHeight + 'px'

  canvas.width = canvasWidth * dpr
  canvas.height = canvasHeight * dpr
  ctx.scale(dpr, dpr)
  // 디바이스의 dpr에 따라서 해상도 높여주는 작업
  // dpr이 클수록 선명하게 보임

  particles = []
  const TOTAL = canvasWidth / 10 // 화면 사이즈에 따른 개수 설정

  for (let i = 0; i < TOTAL; i++) {
    const x = randomNumBetween(0, canvasWidth)
    const y = randomNumBetween(0, canvasHeight)
    const radius = randomNumBetween(50, 100)
    const vy = randomNumBetween(1, 5)
    const particle = new Particle(x, y, radius, vy)
    particles.push(particle) // 배열에 추가하기
  }
}

const feGaussianBlur = document.querySelector('feGaussianBlur')
const feColorMatrix = document.querySelector('feColorMatrix')

const controls = new function () {
  this.blurValue = 40
  this.alphaChannel = 100
  this.alphaOffset = -23
  this.acc = 1.03
}

let gui = new dat.GUI()

const f1 = gui.addFolder('Gooey Effect')
f1.open()
f1.add(controls, 'blurValue', 0, 100).onChange(value => {
  feGaussianBlur.setAttribute('stdDeviation', value)
})
f1.add(controls, 'alphaChannel', 0, 100).onChange(value => {
  feColorMatrix.setAttribute('values', `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${value} ${controls.alphaOffset}`)
})
f1.add(controls, 'alphaOffset', -40, 40).onChange(value => {
  feColorMatrix.setAttribute('values', `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${controls.alphaChannel} ${value}`)
})

const f2 = gui.addFolder('Particle Property')
f2.open()
f2.add(controls, 'acc', 1, 1.5, 0.01).onChange(value => {
  particles.forEach(particle => particle.acc = value)
})

class Particle {
  constructor(x, y, radius, vy) {
    this.x = x
    this.y = y
    this.radius = radius
    this.vy = vy
    this.acc = 1.03 // 1미만이면 느려지고 1초과이면 빨라짐
  }
  update() {
    this.vy *= this.acc // 떨어지는 속도 조절
    this.y += this.vy // y의 증가량
  }
  draw() {
    ctx.beginPath() // 그리기 시작
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI / 180 * 360)
    // arc(x, y, 반지름, 시작 각도, 끝 각도, 시계방향(기본:false -> 시계방향) )
    ctx.fillStyle = 'orange' // 배경색 지정
    ctx.fill() // 색 채우기
    // ctx.stroke() // 선 그리기
    ctx.closePath() // 그리기 끝
  }
}

const x = 100
const y = 100
const radius = 50
const particle = new Particle(x, y, radius) // 새로운 인스턴스 생성
const randomNumBetween = (min, max) => {
  return Math.random() * (max - min + 1) + min
  // Math.random()은 0 이상 1 미만의 난수를 생성
  // +1을 더해 0이상 1이하로 만들기
  // min를 더해주면서 min이상 max이하
}

let interval = 1000 / 60 // 60fps 기준
let now, delta
let then = Date.now()

function animate() {
  window.requestAnimationFrame(animate) // 무한 동작  
  now = Date.now()
  delta = now - then

  if (delta < interval) return

  ctx.clearRect(0, 0, canvasWidth, canvasHeight) //canvas 리셋

  particles.forEach(particle => {
    particle.update() // 실행    
    particle.draw() // 실행    

    if (particle.y - particle.radius > canvasHeight) { //움직임 재생성
      particle.y = -particle.radius // 원형이 완전히 사라지고 애니메이션
      particle.x = randomNumBetween(0, canvasWidth)
      particle.radius = randomNumBetween(50, 100)
      particle.vy = randomNumBetween(1, 5)
    }

  });

  then = now - (delta % interval) // delta가 interval보다 커지면 실행됨
}

window.addEventListener('load', () => {
  init();
  animate();
})

window.addEventListener('resize', () => {
  init();
})
