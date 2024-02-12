import Particle from './js/Particle.js'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const dpr = devicePixelRatio
const interval = 1000 / 60 
// 모니터 주사율이 60hz : 약 16ms 마다 requestAnimationFrame이 실행
// fps 낮을수록 빈도수가 낮고 높을수록 빈도수가 높으므로 더 부드러운 연출 가능
// 일반으로적 모니터 주상율이 최소 60hz이므로 같은 속도로 맞추기 위해 fps를 60으로 사용 
// 1초에 60번 프레임 실행
let canvasWidth = innerWidth
let canvasHeight = innerHeight

let particles = []

function init() {
  canvasWidth = innerWidth
  canvasHeight = innerHeight
  canvas.style.width = canvasWidth + 'px'
  canvas.style.height = canvasHeight + 'px'
  canvas.width = canvasWidth * dpr
  canvas.height = canvasHeight * dpr
  ctx.scale(dpr, dpr)
}

function createRing() {
  const PARTICLE_NUM = 800
  for (let i = 0; i < PARTICLE_NUM; i++) {
    particles.push(new Particle())
  }
}

function render() {
  let now, delta
  let then = Date.now() // 값 초기화

  const frame = () => {
    requestAnimationFrame(frame) // 재귀함수 (자기자신 반복)
    now = Date.now()
    delta = now - then 
    if (delta < interval) return 
    // 약 16ms 마다 requestAnimationFrame이 실행
    ctx.clearRect(0, 0, canvasWidth, canvasHeight) // 덮어쓰기가 아니라 지우고 다시 그리기

    for (let i =  particles.length -1; i >=0; i--) {
      particles[i].update()
      particles[i].draw(ctx) // 인자 넣어주기

      if (particles[i].opacity < 0) particles.splice(i, 1)
    }

    // forEach 사용시 splice 처리된 자리에 다시 particle이 생성되어 깜빡거리는 현상 발생
    // particles.forEach((particle, index) => {
    //   particle.update()
    //   particle.draw(ctx) // 인자 넣어주기

    //   if (particle.opacity < 0) particles.splice(index, 1)
    // })

    then = now - (delta % interval)
  }
  requestAnimationFrame(frame)
}

window.addEventListener('load', () => {
  init()
  render()
})

window.addEventListener('resize', init)

window.addEventListener('click', () => {
  const texts = document.querySelectorAll('span')
  const countDownOption = {
    scale: 1,
    opacity: 1,
    duration: 0.4,
    ease: 'Power4.easeOut'
  }

  gsap.fromTo(texts[0], { opacity: 0, scale: 5 }, {
    ...countDownOption // 전개 연산자 (배열, 객체의 요소)
  })
  gsap.fromTo(texts[1], { opacity: 0, scale: 5 }, {
    ...countDownOption,
    delay: 1,
    onStart: () => texts[0].style.opacity = 0
  })
  gsap.fromTo(texts[2], { opacity: 0, scale: 5 }, {
    ...countDownOption,
    delay: 2,
    onStart: () => texts[1].style.opacity = 0
  })

  const ringImg = document.querySelector('#ring')
  gsap.fromTo(ringImg, { opacity: 1 }, {
    opacity: 0,
    duration: 1,
    delay: 3,
    onStart: () => {
      texts[2].style.opacity = 0
      createRing()
    }
  })
})