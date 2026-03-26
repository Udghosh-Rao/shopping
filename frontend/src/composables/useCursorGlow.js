import { onMounted, onUnmounted } from 'vue'

export function useCursorGlow() {
  let cursor = null

  onMounted(() => {
    cursor = document.createElement('div')
    cursor.className = 'cursor-glow'
    document.body.appendChild(cursor)

    const move = (e) => {
      cursor.style.left = e.clientX - 10 + 'px'
      cursor.style.top  = e.clientY - 10 + 'px'
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  })

  onUnmounted(() => cursor?.remove())
}
