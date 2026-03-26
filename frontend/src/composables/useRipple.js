export function useRipple() {
  function createRipple(event) {
    const button = event.currentTarget
    const circle = document.createElement('span')
    const diameter = Math.max(button.clientWidth, button.clientHeight)
    const radius = diameter / 2
    const rect = button.getBoundingClientRect()
    circle.style.width = circle.style.height = `${diameter}px`
    circle.style.left  = `${event.clientX - rect.left  - radius}px`
    circle.style.top   = `${event.clientY - rect.top   - radius}px`
    circle.className = 'ripple-effect'
    button.classList.add('ripple-container')
    const existing = button.querySelector('.ripple-effect')
    if (existing) existing.remove()
    button.appendChild(circle)
    setTimeout(() => circle.remove(), 600)
  }
  return { createRipple }
}
