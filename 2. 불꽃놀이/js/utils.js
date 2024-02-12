export const randomNumBetween = (min, max) => {
  return Math.random() * (max - min) + min 
  // Math.random()은 0 이상이고 1 미만의 난수(무작위 수)를 생성
  // min을 더함으로써 min 이상 max 미만의 범위 설정
}
export const hypotenuse = (x, y) => {
    return Math.sqrt(Math.pow(x,2) + (Math.pow(y,2))) 
    // c의제곱(거리) = a의제곱 + b의제곱
}
