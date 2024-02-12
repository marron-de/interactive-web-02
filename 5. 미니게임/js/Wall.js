import App from "./App.js"
import BoundingBox from "./BoundingBox.js"
import { randomNumBetween } from './utils.js'

export default class Wall {
  constructor(config) {
    this.img = document.querySelector('#wall-img')
    this.type = config.type // type : BIG, SMALL
    switch (this.type) {
      case 'BIG':
        this.sizeX = 18 / 30
        this.sx = this.img.width * (9 / 30) // x의 시작 위치        
        break
      case 'SMALL':
        this.sizeX = 9 / 30
        this.sx = this.img.width * (0 / 30) // x의 시작 위치       
        break      
    }

    this.width = App.height * this.sizeX
    this.height = App.height

    this.gapY = randomNumBetween(App.height * 0.2, App.height * 0.35) // 20~35%
    this.x = App.width // 초기에 오른쪽 맨끝에서 위치
    this.y1 = -this.height + randomNumBetween(30, App.height - this.gapY - 30)
    // 최소 : -this.height 최대 : App.height - this.gapY - this.height
    // 최소와 최대에 30 정도 값을 더하고 빼서 약간 풀이 보여주게 처리하기
    this.y2 = this.y1 + this.height + this.gapY
    
    this.generatedNext = false // 초기값 벽생성 X
    this.gapNextX = App.width * randomNumBetween(0.6, 0.75)// 가로의 60~75%

    this.boundingBox1 = new BoundingBox(this.x + 30, this.y1 + 30, this.width - 60, this.height - 60)
    this.boundingBox2 = new BoundingBox(this.x + 30, this.y2 + 30, this.width - 60, this.height - 60)
    // 이미지 빈 영백 타이트하게 조절

    this.vx = -6
  }

  get isOutside() { // 안보이는 시점
    return this.x + this.width < 0
  }

  get canGenerateNext() { // 다음 벽 생성
    return (
      !this.generatedNext && this.x + this.width < this.gapNextX
      // this.x + this.width => 벽이 차지하는 x 위치
    )
  }

  isColliding(target) {
    return (
      this.boundingBox1.isColliding(target) ||
      this.boundingBox2.isColliding(target)
    )
  }

  update() {
    this.x += this.vx
    this.boundingBox1.x = this.boundingBox2.x = this.x + 30
  }

  draw() {
    // this.x = 700 // 임의 코드
    // this.boundingBox1.x = this.boundingBox2.x = this.x + 30 // 임의 코드

    App.ctx.drawImage( // sy는 항상 0부터 시작 (위에서부터 그리기때문)
      this.img,
      this.sx, 0, this.sizeX * this.img.width, this.img.height,
      this.x, this.y1, this.width, this.height
    )
    App.ctx.drawImage(
      this.img,
      this.sx, 0, this.sizeX * this.img.width, this.img.height,
      this.x, this.y2, this.width, this.height
    )
    // this.boundingBox1.draw()
    // this.boundingBox2.draw()
  }
}