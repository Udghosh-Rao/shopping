import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

export function useCountUp() {
  const count = ref(0)
  const targetElement = ref(null)
  
  function startCount(targetValue, durationMs = 1500) {
    let start = null
    const finalValue = parseFloat(targetValue)
    if (isNaN(finalValue)) {
      count.value = targetValue
      return
    }
    const isFloat = !Number.isInteger(finalValue)
    
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = timestamp - start
      const percentage = Math.min(progress / durationMs, 1)
      const current = finalValue * percentage
      count.value = isFloat ? current.toFixed(1) : Math.floor(current)
      if (progress < durationMs) {
        window.requestAnimationFrame(step)
      } else {
        count.value = targetValue
      }
    }
    window.requestAnimationFrame(step)
  }

  function observeAndCount(targetValue, durationMs = 1500) {
    const { stop } = useIntersectionObserver(
      targetElement,
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          startCount(targetValue, durationMs)
          stop()
        }
      },
      { threshold: 0.1 }
    )
  }
  
  return { count, targetElement, startCount, observeAndCount }
}
