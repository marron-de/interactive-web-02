export function getDistance(p1, p2) { // 두 좌표 사이의 거리
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.sqrt(dx * dx + dy * dy);
}

export function getAngle(p1, p2) { // 두 좌표 사이의 절대각도
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.atan2(dy, dx) 
}

export function getScrupedPercent(ctx, width, height) {
  const pixels = ctx.getImageData(0, 0, width, height)
  const gap = 32 // rgba(0,0,0,0) => 4자리수인데 일부만 확인하기 4의 배수로 조회
  const total = pixels.data.length / gap
  let count = 0

  for (let i = 0; i < pixels.data.length - 3; i += gap) {
    if (pixels.data[i + 3] === 0 )  count++
  }

  return Math.round(count / total * 100) // 빈 여백 체크하여 백분율로 변환
}

export function drawImageCenter(canvas, ctx, image) {
  const cw = canvas.width
  const ch = canvas.height

  const iw = image.width
  const ih = image.height

  const cr = ch / cw // canvas ratio
  const ir = ih / iw // image ratio

  let sx, sy, sw, sh 

  if (ir >= cr) { // 세로가 긴 직사강형
    sw = iw
    sh = sw * (ch / cw) // sw : sh = cw : ch
  } else { // 가로가 긴 직사각형
    sh = ih
    sw = sh * (cw / ch) // sw : sh = cw : ch
  }

  sx = iw / 2 - sw / 2 // canvas 중간좌표 x에서 image 중간좌표를 빼면 x를 구할수있다
  sy = ih / 2 - sh / 2 // canvas 중간좌표 y에서 image 중간좌표를 빼면 y를 구할수있다
 
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, cw, ch)
}