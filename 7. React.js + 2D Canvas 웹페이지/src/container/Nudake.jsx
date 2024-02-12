import { useEffect, useRef } from 'react'
import throttle from 'lodash/throttle' // 필요한 부분만 import 하여 용량 낮추기
import gsap from 'gsap'
import '../style/container/Nudake.css'

import image1 from '../assets/nudake-1.jpg'
import image2 from '../assets/nudake-2.jpg'
import image3 from '../assets/nudake-3.jpg'
import { drawImageCenter, getAngle, getDistance, getScrupedPercent } from '../utils/utils'

const Nudake = () => {
  const canvasRef = useRef(null) // canvas가 렌더링 되기 전에 실행되므로 null

  useEffect(()=> { // nudake가 렌더링된 이후 실행됨
    const canvas = canvasRef.current 
    const canvasParent = canvas.parentNode
    const ctx = canvas.getContext('2d')

    const imageSrcs = [image1, image2, image3]
    const loadedImages = []
    let currIndex = 0 
    let prevPos = { x : 0, y : 0}
    let isChanging = false

    let canvasWidth, canvasHeight

    function resize() {
      canvasWidth = canvasParent.clientWidth
      canvasHeight = canvasParent.clientHeight   
      canvas.style.widht = canvasWidth + 'px'   
      canvas.style.height = canvasHeight + 'px'   
      canvas.width = canvasWidth
      canvas.height = canvasHeight

      preloadImages().then(() => drawImage())
    }
  
    function preloadImages() {
      return new Promise((resolve, reject) => {
        let loaded = 0
        imageSrcs.forEach(src => {
          const img = new Image()
          img.src = src
          img.onload = () => {
            loaded += 1
            loadedImages.push(img)
            if (loaded === imageSrcs.length) return resolve()
          }
        })
      })
    }

    function drawImage() {
      isChanging = true
      const image = loadedImages[currIndex]
      const firstDrawing = ctx.globalCompositeOperation === 'source-over'

      gsap.to(canvas, {
        opacity: 0, duration: firstDrawing ? 0 : 1, onComplete: () => {
          canvas.style.opacity = 1
          ctx.globalCompositeOperation = 'source-over' // 교집합 영역이 사라짐  
          drawImageCenter(canvas, ctx, image)

          const nextImage = imageSrcs[(currIndex + 1) % imageSrcs.length] // 0, 1, 2 반복
          canvasParent.style.backgroundImage = `url(${nextImage})`
          prevPos = null // 초기화

          isChanging = false
        }
      })      
    }

    function onMouseDown(e) {    
      if (isChanging) return
      canvas.addEventListener('mouseup', onMouseUp)
      canvas.addEventListener('mouseleave', onMouseUp)
      canvas.addEventListener('mousemove', onMouseMove)
      prevPos = { x : e.offsetX, y : e.offsetY}
    }

    function onMouseUp() {
      canvas.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('mouseleave', onMouseUp)
      canvas.removeEventListener('mousemove', onMouseMove)
    }

    function onMouseMove(e) {      
      if (isChanging) return
      drawCircles(e)
      checkPercent()
    }

    function drawCircles(e) {
      const nextPos = { x : e.offsetX, y : e.offsetY}
      if (!prevPos) prevPos = nextPos
      const disct = getDistance(prevPos, nextPos)
      const angle = getAngle(prevPos, nextPos)      

      for (let i = 0; i < disct; i ++) { // 드래그할때 중간 여백없이 그려지게 하기위해서
        const x = prevPos.x + Math.cos(angle) * i
        const y = prevPos.y + Math.sin(angle) * i

        ctx.globalCompositeOperation = 'destination-out' // 교집합 영역이 사라짐
        ctx.beginPath()
        ctx.arc(x, y, canvasWidth / 15, 0, Math.PI *2)
        ctx.fill()
        ctx.closePath()
      }

      prevPos = nextPos  // 현재 값을 이전 값으로 

    }

    const checkPercent = throttle(() => {
      const percent = getScrupedPercent(ctx, canvasWidth, canvasHeight)
      if (percent > 50) {
        currIndex = (currIndex + 1) % imageSrcs.length
        drawImage()
      }
    }, 500)

    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('resize', resize)
    resize()

    return () => { // 컴포넌트가 어마운트될때 실행
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('resize',resize)
    }
  }, []) // 초기 렌더링만 실행

  return(
    <div className='nudake'>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default Nudake