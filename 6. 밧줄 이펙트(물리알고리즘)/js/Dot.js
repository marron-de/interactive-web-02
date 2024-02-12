import Vector from "./Vector.js";

export default class Dot {
  // 점이기때문에 x, y 인자로 사용
  constructor(x, y) {
    this.pos = new Vector(x, y); // 위치
    this.oldPos = new Vector(x, y); // 이전 위치

    this.radius = 1
    this.gravity = new Vector(0, 1);
    this.friction = 0.97;

    this.pinned = false;

    this.mass = 1;

    this.lightImg = document.querySelector('#light-img')
    this.lightWidth = 15
    this.lightHeight = 15
  }

  update(mouse) {
    if (this.pinned) return;

    let vel = Vector.sub(this.pos, this.oldPos);
    // 평균 속도 = 이동한 거리 / 걸린 시간 = this.pos - this.oldPos / 1(프레임)

    this.oldPos.setXY(this.pos.x, this.pos.y); // 지금 속도를 이전 속도로 설정

    vel.mult(this.friction); // 어느 시점부터 속도 일정하게 만들어줌
    vel.add(this.gravity);
    this.pos.add(vel);
    
    let { x: dx, y: dy } = Vector.sub(mouse.pos, this.pos);
    // 시작점 A에서 끝점 B로 향하는 방향 벡터 = (B.x - A.x, B.y - A.y)
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > mouse.radius + this.radius) return
    const direction = new Vector(dx / dist, dy / dist);
    // 방향성만 구하기 => x의 방향 : dx / dist, y의 방향 : dy / dist

    let force = Math.max((mouse.radius - dist) / mouse.radius , 0) 
    // 당겨는 힘 = (반지름 - 거리) / 반지름, 범위는 0 ~ 1, 최소값이 0이 되어야함
    // force 0 이면 마우스 범위 끝을 말하며 1 이면 마우스 범위 중점에 제일 가까운 것을 말한다.

    if (force > 0.6) {
      this.pos.setXY(mouse.pos.x, mouse.pos.y);
    } else {     
      this.pos.add(direction.mult(force).mult(0.001));
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#999";
    ctx.fillRect(this.pos.x - this.radius, this.pos.y - this.radius, this.radius * 2, this.radius * 2)
  }
  
  drawLight(ctx) {
    ctx.drawImage(
      this.lightImg,
      this.pos.x - this.lightWidth / 2, this.pos.y - this.lightHeight / 2, this.lightWidth, this.lightHeight
    )
  }
}
