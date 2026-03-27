import { ref } from 'vue'

export const useCountUp = () => {
  const count = ref(0)

  const startCount = (target, duration = 800) => {
    const startTime = performance.now()
    const from = 0

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      count.value = Math.round(from + (target - from) * ease)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  return { count, startCount }
}
