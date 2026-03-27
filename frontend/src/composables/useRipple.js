export const useRipple = () => {
  const createRipple = (event) => {
    const el = event.currentTarget
    const circle = document.createElement('span')
    const d = Math.max(el.clientWidth, el.clientHeight)
    const rect = el.getBoundingClientRect()

    circle.style.cssText = `
      width:${d}px; height:${d}px;
      left:${event.clientX - rect.left - d / 2}px;
      top:${event.clientY - rect.top - d / 2}px;
    `
    circle.classList.add('ripple-effect')
    el.classList.add('ripple-container')
    el.querySelector('.ripple-effect')?.remove()
    el.appendChild(circle)
    setTimeout(() => circle.remove(), 600)
  }

  return { createRipple }
}
