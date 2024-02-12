export default class CanvasOption {
  constructor() {
    this.canvas = document.querySelector('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.dpr = devicePixelRatio
    this.fps = 60
    this.interval = 1000 / this.fps
    // 모니터 주사율이 60hz : 약 16ms 마다 requestAnimationFrame이 실행
    // fps 낮을수록 빈도수가 낮고 높을수록 빈도수가 높으므로 더 부드러운 연출 가능
    // 일반으로적 모니터 주상율이 최소 60hz이므로 같은 속도로 맞추기 위해 fps를 60으로 사용 
    // 1초에 60번 프레임 실행
    this.canvasWidth = innerWidth
    this.canvasHeight = innerHeight
    this.bgColor = '#000000'
  }
}